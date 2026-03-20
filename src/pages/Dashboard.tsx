import { useNavigate } from "react-router-dom";
import { ShoppingCart, Settings2, Receipt, BarChart3, Users } from "lucide-react";
import { getPurchases, getProductions, getSales } from "@/lib/storage";
import { formatINR } from "@/lib/calc";

const actions = [
  { to: "/parties", icon: Users, label: "👥 Parties", color: "bg-secondary text-secondary-foreground" },
  { to: "/buy", icon: ShoppingCart, label: "🧵 Buy Yarn", color: "bg-primary text-primary-foreground" },
  { to: "/production", icon: Settings2, label: "⚙️ Production", color: "bg-accent text-accent-foreground" },
  { to: "/sell", icon: Receipt, label: "🧾 Sell Cloth", color: "bg-info text-info-foreground" },
  { to: "/reports", icon: BarChart3, label: "📊 Reports", color: "bg-warning text-warning-foreground" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const purchases = getPurchases();
  const productions = getProductions();
  const sales = getSales();

  const totalSpent = purchases.reduce((s, p) => s + p.totalCost, 0);
  const totalEarned = sales.reduce((s, p) => s + p.totalAmount, 0);
  const totalCloth = productions.reduce((s, p) => s + p.clothProducedMeters, 0);

  return (
    <div className="p-4 space-y-6">
      <header className="pt-4 text-center">
        <h1 className="text-2xl font-extrabold">🧵 Cloth Calculator</h1>
        <p className="text-muted-foreground text-sm mt-1">Your simple cloth business manager</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="result-highlight">
          <p className="text-xs text-muted-foreground">Spent</p>
          <p className="font-bold text-base">{formatINR(totalSpent)}</p>
        </div>
        <div className="result-highlight">
          <p className="text-xs text-muted-foreground">Earned</p>
          <p className="font-bold text-base text-accent">{formatINR(totalEarned)}</p>
        </div>
        <div className="result-highlight">
          <p className="text-xs text-muted-foreground">Cloth</p>
          <p className="font-bold text-base">{totalCloth.toFixed(1)}m</p>
        </div>
      </div>

      {/* Big Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {actions.map(({ to, icon: Icon, label, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`big-action-btn ${color}`}
          >
            <Icon size={36} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Profit highlight */}
      {(totalSpent > 0 || totalEarned > 0) && (
        <div className="result-highlight">
          <p className="text-sm text-muted-foreground">Net Profit / Loss</p>
          <p className={`text-2xl font-extrabold ${totalEarned - totalSpent >= 0 ? 'text-accent' : 'text-destructive'}`}>
            {formatINR(totalEarned - totalSpent)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
