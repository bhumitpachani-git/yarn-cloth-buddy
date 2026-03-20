import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addPurchase, addParty, getPurchases, getParties, uid, deletePurchase } from "@/lib/storage";
import { costPerKg, formatINR } from "@/lib/calc";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BuyYarn = () => {
  const navigate = useNavigate();
  const parties = getParties();
  const [partyName, setPartyName] = useState("");
  const [customParty, setCustomParty] = useState("");
  const [kg, setKg] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [purchases, setPurchases] = useState(getPurchases);

  const refresh = () => setPurchases(getPurchases());
  const effectiveParty = partyName === "__new__" ? customParty : partyName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kgN = parseFloat(kg);
    const costN = parseFloat(totalCost);
    if (!effectiveParty || !kgN || !costN) { toast.error("Please fill all fields"); return; }
    addPurchase({ id: uid(), date: new Date().toISOString(), partyName: effectiveParty, yarnKg: kgN, totalCost: costN, costPerKg: costPerKg(costN, kgN) });
    addParty(effectiveParty);
    toast.success(`Saved! Cost/kg = ${formatINR(costPerKg(costN, kgN))}`);
    setPartyName(""); setCustomParty(""); setKg(""); setTotalCost("");
    refresh();
  };

  return (
    <div className="p-4 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">🧵 Buy Yarn</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-muted-foreground">Party Name</label>
          <Select value={partyName} onValueChange={setPartyName}>
            <SelectTrigger className="mt-1 h-12 text-base"><SelectValue placeholder="Select party" /></SelectTrigger>
            <SelectContent>
              {parties.map(p => (
                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
              ))}
              <SelectItem value="__new__">➕ Add New Party</SelectItem>
            </SelectContent>
          </Select>
          {partyName === "__new__" && (
            <Input value={customParty} onChange={e => setCustomParty(e.target.value)} placeholder="Enter new party name" className="mt-2 text-base h-12" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Yarn (kg)</label>
            <Input type="number" step="0.01" value={kg} onChange={e => setKg(e.target.value)} placeholder="10" className="mt-1 text-base h-12" />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Total Cost (₹)</label>
            <Input type="number" step="0.01" value={totalCost} onChange={e => setTotalCost(e.target.value)} placeholder="1000" className="mt-1 text-base h-12" />
          </div>
        </div>
        {kg && totalCost && parseFloat(kg) > 0 && (
          <div className="result-highlight">
            <p className="text-sm text-muted-foreground">Cost per Kg</p>
            <p className="text-2xl font-extrabold text-primary">{formatINR(costPerKg(parseFloat(totalCost), parseFloat(kg)))}</p>
          </div>
        )}
        <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl">💾 Save Purchase</Button>
      </form>

      {purchases.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-muted-foreground text-sm">Recent Purchases</h2>
          {purchases.slice(0, 10).map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-3">
              <div>
                <p className="font-semibold text-sm">{p.partyName}</p>
                <p className="text-xs text-muted-foreground">{p.yarnKg}kg · {formatINR(p.totalCost)} · {formatINR(p.costPerKg)}/kg</p>
              </div>
              <button onClick={() => { deletePurchase(p.id); refresh(); }} className="text-destructive p-1"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyYarn;
