// ─── DashboardLayout.jsx ──────────────────────────────────────────────────────
// Shell: sidebar + topbar + page router. All pages read from AppContext.

import { useState }    from "react";
import { colors }      from "./styles/tokens";
import Sidebar         from "./components/dashboard/Sidebar";
import TopBar          from "./components/dashboard/TopBar";
import ToastContainer  from "./components/ui/ToastContainer";
import DashboardPage   from "./pages/DashboardPage";
import ProductsPage    from "./pages/ProductsPage";
import UsersPage       from "./pages/UsersPage";
import OrdersPage      from "./pages/OrdersPage";
import SettingsPage    from "./pages/SettingsPage";
import { useApp }      from "./AppContext";

const DashboardLayout = ({ onLogout }) => {
  const { currentUser } = useApp();
  const [active, setActive] = useState("dashboard");

  const render = () => {
    switch (active) {
      case "products": return <ProductsPage />;
      case "users":    return <UsersPage />;
      case "orders":   return <OrdersPage />;
      case "settings": return <SettingsPage />;
      default:         return <DashboardPage />;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:colors.bg, color:colors.text }}>
      <Sidebar user={currentUser} active={active} onNav={setActive} onLogout={onLogout} />

      <div style={{ marginLeft:"230px", flex:1, display:"flex", flexDirection:"column" }}>
        <TopBar active={active} />
        <main style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
          {render()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
