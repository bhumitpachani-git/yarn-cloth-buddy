import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

const AppLayout = () => (
  <div className="mx-auto min-h-screen max-w-lg pb-20">
    <Outlet />
    <BottomNav />
  </div>
);

export default AppLayout;
