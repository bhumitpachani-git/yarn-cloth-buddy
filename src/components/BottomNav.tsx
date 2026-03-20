import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Settings2, Receipt, BarChart3 } from "lucide-react";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/buy", icon: ShoppingCart, label: "Buy Yarn" },
  { to: "/production", icon: Settings2, label: "Production" },
  { to: "/sell", icon: Receipt, label: "Sell" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

const BottomNav = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-[0_-2px_10px_hsl(var(--border)/0.5)]">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink key={to} to={to} className="bottom-nav-item">
              <div className={`rounded-xl p-1.5 ${active ? "bg-primary/10" : ""}`}>
                <Icon size={22} className={active ? "text-primary" : "text-muted-foreground"} />
              </div>
              <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
