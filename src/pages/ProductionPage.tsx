import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPurchases, addProduction, getProductions, uid, deleteProduction, type Purchase } from "@/lib/storage";
import { costPerMeter, effectiveYarn, formatINR } from "@/lib/calc";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ProductionPage = () => {
  const navigate = useNavigate();
  const purchases = getPurchases();
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [wastage, setWastage] = useState("");
  const [cloth, setCloth] = useState("");
  const [productions, setProductions] = useState(getProductions);

  const refresh = () => setProductions(getProductions());
  const selectedPurchase = purchases.find(p => p.id === selectedPurchaseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPurchase) { toast.error("Select a purchase"); return; }
    const wN = parseFloat(wastage) || 0;
    const cN = parseFloat(cloth);
    if (!cN) { toast.error("Enter cloth meters"); return; }
    const eff = effectiveYarn(selectedPurchase.yarnKg, wN);
    const effCost = selectedPurchase.costPerKg * eff;
    const cpm = costPerMeter(effCost, cN);
    addProduction({ id: uid(), date: new Date().toISOString(), purchaseId: selectedPurchase.id, yarnUsedKg: selectedPurchase.yarnKg, wastageKg: wN, clothProducedMeters: cN, costPerMeter: cpm, effectiveYarnKg: eff, totalCost: effCost });
    toast.success(`Saved! Cost/meter = ${formatINR(cpm)}`);
    setSelectedPurchaseId(""); setWastage(""); setCloth("");
    refresh();
  };

  return (
    <div className="p-4 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">⚙️ Production</h1>
      </header>

      {purchases.length === 0 ? (
        <div className="result-highlight"><p className="text-muted-foreground">No purchases yet. Buy yarn first!</p></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Select Purchase</label>
            <Select value={selectedPurchaseId} onValueChange={setSelectedPurchaseId}>
              <SelectTrigger className="mt-1 h-12 text-base"><SelectValue placeholder="Select yarn purchase" /></SelectTrigger>
              <SelectContent>
                {purchases.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.partyName} – {p.yarnKg}kg @ {formatINR(p.costPerKg)}/kg</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Wastage (kg)</label>
              <Input type="number" step="0.01" value={wastage} onChange={e => setWastage(e.target.value)} placeholder="0" className="mt-1 text-base h-12" />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Cloth (meters)</label>
              <Input type="number" step="0.01" value={cloth} onChange={e => setCloth(e.target.value)} placeholder="5" className="mt-1 text-base h-12" />
            </div>
          </div>
          {selectedPurchase && cloth && parseFloat(cloth) > 0 && (
            <div className="result-highlight">
              <p className="text-sm text-muted-foreground">💰 Cost per Meter</p>
              <p className="text-3xl font-extrabold text-primary">
                {formatINR(costPerMeter(selectedPurchase.costPerKg * effectiveYarn(selectedPurchase.yarnKg, parseFloat(wastage) || 0), parseFloat(cloth)))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Usable yarn: {effectiveYarn(selectedPurchase.yarnKg, parseFloat(wastage) || 0).toFixed(2)}kg
              </p>
            </div>
          )}
          <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl">💾 Save Production</Button>
        </form>
      )}

      {productions.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-muted-foreground text-sm">Recent Productions</h2>
          {productions.slice(0, 10).map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-3">
              <div>
                <p className="font-semibold text-sm">{p.clothProducedMeters}m cloth · {p.wastageKg}kg waste</p>
                <p className="text-xs text-muted-foreground">{formatINR(p.costPerMeter)}/meter</p>
              </div>
              <button onClick={() => { deleteProduction(p.id); refresh(); }} className="text-destructive p-1"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductionPage;
