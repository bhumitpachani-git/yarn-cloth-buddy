import { useNavigate } from "react-router-dom";
import { getPurchases, getProductions, getSales } from "@/lib/storage";
import { formatINR } from "@/lib/calc";
import { ArrowLeft } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();
  const purchases = getPurchases();
  const productions = getProductions();
  const sales = getSales();

  const totalSpent = purchases.reduce((s, p) => s + p.totalCost, 0);
  const totalYarnKg = purchases.reduce((s, p) => s + p.yarnKg, 0);
  const totalWastage = productions.reduce((s, p) => s + p.wastageKg, 0);
  const totalCloth = productions.reduce((s, p) => s + p.clothProducedMeters, 0);
  const totalSold = sales.reduce((s, p) => s + p.metersSold, 0);
  const totalEarned = sales.reduce((s, p) => s + p.totalAmount, 0);
  const avgCostPerMeter = productions.length > 0 ? productions.reduce((s, p) => s + p.costPerMeter, 0) / productions.length : 0;
  const avgSellingRate = sales.length > 0 ? sales.reduce((s, p) => s + p.ratePerMeter, 0) / sales.length : 0;
  const profit = totalEarned - totalSpent;

  const stats = [
    { label: "Total Yarn Bought", value: `${totalYarnKg.toFixed(1)} kg` },
    { label: "Total Spent", value: formatINR(totalSpent) },
    { label: "Total Wastage", value: `${totalWastage.toFixed(1)} kg` },
    { label: "Cloth Produced", value: `${totalCloth.toFixed(1)} meters` },
    { label: "Avg Cost/Meter", value: formatINR(avgCostPerMeter) },
    { label: "Cloth Sold", value: `${totalSold.toFixed(1)} meters` },
    { label: "Total Earned", value: formatINR(totalEarned) },
    { label: "Avg Selling Rate", value: formatINR(avgSellingRate) },
  ];

  return (
    <div className="p-4 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">📊 Reports</h1>
      </header>

      <div className="result-highlight">
        <p className="text-sm text-muted-foreground">Net Profit / Loss</p>
        <p className={`text-3xl font-extrabold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}>
          {formatINR(profit)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-card border border-border p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-bold text-sm mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Party-wise summary */}
      {sales.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-muted-foreground text-sm">Party-wise Sales</h2>
          {Object.entries(
            sales.reduce<Record<string, { meters: number; amount: number }>>((acc, s) => {
              if (!acc[s.partyName]) acc[s.partyName] = { meters: 0, amount: 0 };
              acc[s.partyName].meters += s.metersSold;
              acc[s.partyName].amount += s.totalAmount;
              return acc;
            }, {})
          ).map(([name, data]) => (
            <div key={name} className="rounded-xl bg-card border border-border p-3">
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-muted-foreground">{data.meters.toFixed(1)}m · {formatINR(data.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
