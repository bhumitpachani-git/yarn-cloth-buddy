import { useNavigate, useParams } from "react-router-dom";
import { getPurchases, getSales } from "@/lib/storage";
import { formatINR } from "@/lib/calc";
import { ArrowLeft } from "lucide-react";

const PartyHistory = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const partyName = decodeURIComponent(name || "");

  const purchases = getPurchases().filter(p => p.partyName.toLowerCase() === partyName.toLowerCase());
  const sales = getSales().filter(s => s.partyName.toLowerCase() === partyName.toLowerCase());

  const totalBought = purchases.reduce((s, p) => s + p.totalCost, 0);
  const totalSold = sales.reduce((s, p) => s + p.totalAmount, 0);

  return (
    <div className="p-4 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate("/parties")} className="text-muted-foreground"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">👤 {partyName}</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="result-highlight">
          <p className="text-xs text-muted-foreground">Total Bought</p>
          <p className="font-bold text-base">{formatINR(totalBought)}</p>
        </div>
        <div className="result-highlight">
          <p className="text-xs text-muted-foreground">Total Sold</p>
          <p className="font-bold text-base text-accent">{formatINR(totalSold)}</p>
        </div>
      </div>

      {/* Purchases */}
      {purchases.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-sm text-muted-foreground">🧵 Purchases ({purchases.length})</h2>
          {purchases.map(p => (
            <div key={p.id} className="rounded-xl bg-card border border-border p-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm">{p.yarnKg}kg · {formatINR(p.costPerKg)}/kg</p>
                <p className="font-bold text-sm">{formatINR(p.totalCost)}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{new Date(p.date).toLocaleDateString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sales */}
      {sales.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-sm text-muted-foreground">🧾 Sales ({sales.length})</h2>
          {sales.map(s => (
            <div key={s.id} className="rounded-xl bg-card border border-border p-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm">{s.metersSold}m @ {formatINR(s.ratePerMeter)}/m</p>
                <p className="font-bold text-sm text-accent">{formatINR(s.totalAmount)}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{new Date(s.date).toLocaleDateString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}

      {purchases.length === 0 && sales.length === 0 && (
        <div className="result-highlight">
          <p className="text-muted-foreground">No transactions with this party yet.</p>
        </div>
      )}
    </div>
  );
};

export default PartyHistory;
