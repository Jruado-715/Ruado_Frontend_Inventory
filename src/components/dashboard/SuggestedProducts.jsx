// ─── SuggestedProducts ────────────────────────────────────────────────────────
// AI-recommended products panel shown on the Dashboard Home.
// Props: items (array from data/suggested.js)

import { colors, fonts } from "../../styles/tokens";
import Badge from "../ui/Badge";

const URGENCY_COLOR = { Critical: "red", Promote: "blue" };

const SuggestedProducts = ({ items }) => (
  <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "6px", overflow: "hidden" }}>
    {/* Header */}
    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ fontFamily: fonts.display, fontSize: "1.1rem", letterSpacing: "0.06em", color: "#fff" }}>
        Suggested Products
      </div>
      <div style={{ fontSize: "0.76rem", color: colors.muted, marginTop: "2px" }}>
        AI-recommended actions
      </div>
    </div>

    {/* List */}
    <div style={{ padding: "10px" }}>
      {items.map((p, i) => (
        <div
          key={p.id}
          className="product-card"
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "12px",
            padding:      "11px 10px",
            borderRadius: "4px",
            marginBottom: "6px",
            cursor:       "pointer",
            background:   "rgba(0,0,0,0.25)",
            border:       `1px solid ${colors.border}`,
            animation:    `cardIn 0.4s ${i * 0.1}s both`,
          }}
        >
          <div style={{ fontSize: "1.7rem", flexShrink: 0 }}>{p.img}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.87rem" }}>{p.name}</div>
            <div style={{ fontSize: "0.73rem", color: colors.muted, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {p.reason}
            </div>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>${p.price}</div>
            <Badge color={URGENCY_COLOR[p.urgency] ?? "yellow"}>{p.urgency}</Badge>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SuggestedProducts;
