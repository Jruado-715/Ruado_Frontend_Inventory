// ─── DashboardPage.jsx ────────────────────────────────────────────────────────
// Live stats from context: active orders, low stock, revenue, suggested products.

import { useApp } from "../AppContext";
import { colors, fonts } from "../styles/tokens";
import StatCard          from "../components/dashboard/StatCard";
import SuggestedProducts from "../components/dashboard/SuggestedProducts";
import Badge             from "../components/ui/Badge";
import { suggested }     from "../data/suggested";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const STATUS_COLOR = { Delivered:"green", Shipped:"blue", Processing:"yellow", Pending:"gray" };

const DashboardPage = () => {
  const { products, orders, users } = useApp();

  const activeOrders = orders.filter(o => o.status !== "Delivered").length;
  const lowStock     = products.filter(p => p.stock < 6).length;
  const totalRev     = orders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label:"Total Revenue",   value:`₱${totalRev.toLocaleString()}`, sub:"From delivered orders",  icon:"💰", color:"#2ecc71" },
    { label:"Active Orders",   value:activeOrders,                     sub:"Awaiting fulfilment",    icon:"📦", color:colors.red },
    { label:"Registered Users",value:users.length,                     sub:"Total accounts",         icon:"👥", color:"#3498db" },
    { label:"Low Stock Items", value:lowStock,                         sub:"Need restocking",        icon:"⚠️", color:"#f1c40f" },
  ];

  // Suggested = products with low stock, sorted by stock asc
  const suggestedLive = [...products]
    .filter(p => p.stock < 10)
    .sort((a,b) => a.stock - b.stock)
    .slice(0, 4)
    .map(p => ({ ...p, reason: p.stock < 4 ? "Critical — restock immediately" : "Stock running low", urgency: p.stock < 4 ? "Critical" : "Restock Soon" }));

  return (
    <div style={{ animation:"fadeSlide 0.35s ease both" }}>
      {/* Banner */}
      <div style={{ background:"linear-gradient(135deg,rgba(229,9,20,0.12) 0%,rgba(0,0,0,0) 60%)", border:"1px solid rgba(229,9,20,0.2)", borderRadius:"6px", padding:"26px 30px", marginBottom:"26px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:fonts.display, fontSize:"1.7rem", letterSpacing:"0.06em", color:"#fff" }}>Welcome Back!</div>
          <div style={{ color:colors.muted, fontSize:"0.87rem", marginTop:"4px" }}>Here's what's happening with NYX Inventory today.</div>
        </div>
        <div style={{ fontSize:"2.4rem", opacity:0.5 }}>📊</div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"28px" }}>
        {stats.map((s,i) => <StatCard key={s.label} {...s} delay={i*0.08}/>)}
      </div>

      {/* Two column */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:"18px" }}>

        {/* Active Orders table */}
        <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${colors.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:fonts.display, fontSize:"1.1rem", letterSpacing:"0.06em", color:"#fff" }}>Active Orders</div>
            <Badge color="yellow">{activeOrders} pending</Badge>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"rgba(0,0,0,0.3)" }}>
                {["Order","Customer","Product","Total","Status"].map(h=>(
                  <th key={h} style={{ textAlign:"left", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:colors.muted, padding:"9px 14px", borderBottom:`1px solid ${colors.border}` }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {orders.length === 0
                  ? <tr><td colSpan={5} style={{ padding:"30px", textAlign:"center", color:colors.muted }}>No orders yet</td></tr>
                  : orders.slice(0,8).map(o=>(
                    <tr key={o.id} className="order-row">
                      <td style={{ padding:"10px 14px", fontSize:"0.78rem", color:colors.red, fontWeight:700, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.id}</td>
                      <td style={{ padding:"10px 14px", fontSize:"0.84rem", color:"#ccc", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.customer}</td>
                      <td style={{ padding:"10px 14px", fontSize:"0.80rem", color:colors.muted, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.product}</td>
                      <td style={{ padding:"10px 14px", fontSize:"0.84rem", color:"#fff", fontWeight:600, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>${o.total}</td>
                      <td style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}><Badge color={STATUS_COLOR[o.status]??"gray"}>{o.status}</Badge></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Suggested products — live from stock */}
        {suggestedLive.length > 0
          ? <SuggestedProducts items={suggestedLive}/>
          : (
            <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", color:colors.muted, fontSize:"0.9rem" }}>
              <div style={{ textAlign:"center", padding:"40px" }}>
                <div style={{ fontSize:"2rem", marginBottom:"8px" }}>✅</div>
                All products are well stocked!
              </div>
            </div>
          )
        }
      </div>
      {/* ── Charts Row ── */}
<div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:"18px", marginTop:"18px" }}>

  {/* Bar Chart — Stock per Product */}
  <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", padding:"20px" }}>
    <div style={{ fontFamily:fonts.display, fontSize:"1.1rem", letterSpacing:"0.06em", color:"#fff", marginBottom:"16px" }}>Stock Overview</div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={products.slice(0,8).map(p => ({ name: p.name.length > 10 ? p.name.slice(0,10)+"…" : p.name, stock: p.stock }))}>
        <XAxis dataKey="name" tick={{ fill:"#757575", fontSize:11 }} />
        <YAxis tick={{ fill:"#757575", fontSize:11 }} />
        <Tooltip contentStyle={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#fff" }} />
        <Bar dataKey="stock" fill="#E50914" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Pie Chart — Products by Category */}
  <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", padding:"20px" }}>
    <div style={{ fontFamily:fonts.display, fontSize:"1.1rem", letterSpacing:"0.06em", color:"#fff", marginBottom:"16px" }}>By Category</div>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={["Electronics","Furniture","Peripherals"].map(cat => ({
            name: cat,
            value: products.filter(p => p.category === cat).length
          })).filter(d => d.value > 0)}
          cx="50%" cy="50%"
          innerRadius={55} outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {["#E50914","#3498db","#2ecc71"].map((color, i) => <Cell key={i} fill={color} />)}
        </Pie>
        <Tooltip contentStyle={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#fff" }} labelStyle={{ color:"#fff" }} itemStyle={{ color:"#fff" }} />
        <Legend wrapperStyle={{ color:"#757575", fontSize:"0.8rem" }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
};

export default DashboardPage;
