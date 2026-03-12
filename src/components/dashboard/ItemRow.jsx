// ─── ItemRow ──────────────────────────────────────────────────────────────────
// Products table section with a category title header.
// Original component from ruado_frontend (rebuilt with NYX theme).
// Props: title (string), items (array)

import { colors, fonts } from "../../styles/tokens";
import Badge from "../ui/Badge";

const stockColor  = n => (n < 4 ? "red" : n < 10 ? "yellow" : "green");
const stockLabel  = n => (n < 4 ? "Critical" : n < 10 ? "Low" : "In Stock");

const COLS = ["ID", "Name", "Category", "Stock", "Price", "Trend", "Status"];

const ItemRow = ({ title, items }) => (
  <div style={{ marginBottom: "24px" }}>
    {/* Section title */}
    <div
      style={{
        fontFamily:    fonts.display,
        fontSize:      "1.05rem",
        letterSpacing: "0.06em",
        color:         "#fff",
        padding:       "14px 20px",
        borderBottom:  `1px solid ${colors.border}`,
        background:    colors.surface,
        borderRadius:  "6px 6px 0 0",
        borderTop:     `1px solid ${colors.border}`,
        borderLeft:    `1px solid ${colors.border}`,
        borderRight:   `1px solid ${colors.border}`,
      }}
    >
      {title}
    </div>

    {/* Table */}
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(0,0,0,0.3)" }}>
            {COLS.map(h => (
              <th key={h} style={{ textAlign: "left", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.muted, padding: "9px 14px", borderBottom: `1px solid ${colors.border}` }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="order-row">
              <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: colors.red, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>#{p.id}</td>
              <td style={{ padding: "10px 14px", fontWeight: 700, color: "#fff", fontSize: "0.88rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{p.img} {p.name}</td>
              <td style={{ padding: "10px 14px", color: colors.muted, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{p.category}</td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}><Badge color={stockColor(p.stock)}>{p.stock} units</Badge></td>
              <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>${p.price}</td>
              <td style={{ padding: "10px 14px", color: p.trend.startsWith("+") ? "#2ecc71" : colors.red, fontSize: "0.84rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{p.trend}</td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}><Badge color={stockColor(p.stock)}>{stockLabel(p.stock)}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ItemRow;
