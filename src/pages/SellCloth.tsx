import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addSale, getSales, uid, deleteSale, addParty, getParties } from "@/lib/storage";
import { formatINR } from "@/lib/calc";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SellCloth = () => {
  const navigate = useNavigate();
  const parties = getParties();
  const [partyName, setPartyName] = useState("");
  const [customParty, setCustomParty] = useState("");
  const [meters, setMeters] = useState("");
  const [rate, setRate] = useState("");
  const [sales, setSales] = useState(getSales);

  const refresh = () => setSales(getSales());
  const effectiveParty = partyName === "__new__" ? customParty : partyName;
  const total = (parseFloat(meters) || 0) * (parseFloat(rate) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mN = parseFloat(meters);
    const rN = parseFloat(rate);
    if (!effectiveParty || !mN || !rN) { toast.error("Please fill all fields"); return; }
    addSale({ id: uid(), date: new Date().toISOString(), partyName: effectiveParty, metersSold: mN, ratePerMeter: rN, totalAmount: mN * rN });
    addParty(effectiveParty);
    toast.success(`Saved! Total = ${formatINR(mN * rN)}`);
    setPartyName(""); setCustomParty(""); setMeters(""); setRate("");
    refresh();
  };

  return (
    <div className="p-4 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">🧾 Sell Cloth</h1>
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
            <label className="text-sm font-semibold text-muted-foreground">Meters</label>
            <Input type="number" step="0.01" value={meters} onChange={e => setMeters(e.target.value)} placeholder="10" className="mt-1 text-base h-12" />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Rate/meter (₹)</label>
            <Input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} placeholder="250" className="mt-1 text-base h-12" />
          </div>
        </div>
        {total > 0 && (
          <div className="result-highlight">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-extrabold text-accent">{formatINR(total)}</p>
          </div>
        )}
        <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl">💾 Save Sale</Button>
      </form>

      {sales.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-muted-foreground text-sm">Recent Sales</h2>
          {sales.slice(0, 10).map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-3">
              <div>
                <p className="font-semibold text-sm">{s.partyName}</p>
                <p className="text-xs text-muted-foreground">{s.metersSold}m @ {formatINR(s.ratePerMeter)} = {formatINR(s.totalAmount)}</p>
              </div>
              <button onClick={() => { deleteSale(s.id); refresh(); }} className="text-destructive p-1"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellCloth;
