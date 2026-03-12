// ─── StatCard ─────────────────────────────────────────────────────────────────
// KPI card displayed in the stats grid row on the Dashboard and Orders page.
// Props: label, value, sub, icon, color, delay (animation delay in seconds)

import { colors, fonts } from "../../styles/tokens";

const StatCard = ({ label, value, sub, icon, color, delay = 0 }) => (
  <div
    className="stat-card"
    style={{
      background:   colors.surface,
      border:       `1px solid ${colors.border}`,
      borderRadius: "6px",
      padding:      "20px 22px",
      boxShadow:    "0 4px 16px rgba(0,0,0,0.3)",
      animation:    `cardIn 0.4s ${delay}s both`,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
      <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", color: colors.muted, fontWeight: 700 }}>
        {label}
      </span>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
    </div>

    <div style={{ fontFamily: fonts.display, fontSize: "2.1rem", color, letterSpacing: "0.04em", animation: "countUp 0.5s ease both" }}>
      {value}
    </div>

    {sub && (
      <div style={{ fontSize: "0.76rem", color: colors.muted, marginTop: "4px" }}>{sub}</div>
    )}
  </div>
);

export default StatCard;
