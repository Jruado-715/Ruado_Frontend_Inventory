// ─── ActiveOrdersTable.jsx ────────────────────────────────────────────────────
// Displays recent orders from context. Used on Dashboard Home.
// Props: orders (array)

import { colors, fonts } from "../../styles/tokens";
import Badge from "../ui/Badge";

const STATUS_COLOR = { Delivered:"green", Shipped:"blue", Processing:"yellow", Pending:"gray" };

const ActiveOrdersTable = ({ orders }) => {
  const pending = orders.filter(o => o.status !== "Delivered").length;

  return (
    <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden" }}>
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${colors.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:fonts.display, fontSize:"1.1rem", letterSpacing:"0.06em", color:"#fff" }}>Active Orders</div>
        <Badge color="yellow">{pending} pending</Badge>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"rgba(0,0,0,0.3)" }}>
            {["Order","Customer","Product","Total","Status"].map(h=>(
              <th key={h} style={{ textAlign:"left", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:colors.muted, padding:"9px 14px", borderBottom:`1px solid ${colors.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orders.slice(0,8).map(o=>(
              <tr key={o.id} className="order-row">
                <td style={{ padding:"10px 14px", fontSize:"0.78rem", color:colors.red, fontWeight:700, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.id}</td>
                <td style={{ padding:"10px 14px", fontSize:"0.84rem", color:"#ccc", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.customer}</td>
                <td style={{ padding:"10px 14px", fontSize:"0.80rem", color:colors.muted, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.product}</td>
                <td style={{ padding:"10px 14px", fontSize:"0.84rem", color:"#fff", fontWeight:600, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>${o.total}</td>
                <td style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}><Badge color={STATUS_COLOR[o.status]??"gray"}>{o.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveOrdersTable;
