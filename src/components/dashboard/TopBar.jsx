// ─── TopBar ───────────────────────────────────────────────────────────────────
// Sticky top header showing current page title and live indicator.
// Props: title (string)

import { colors, fonts } from "../../styles/tokens";

const NAV_LABELS = {
  dashboard: "Dashboard",
  products:  "Products",
  users:     "Users",
  orders:    "Orders",
  settings:  "Settings",
};

const TopBar = ({ active }) => (
  <header
    style={{
      height:         "58px",
      background:     "rgba(0,0,0,0.75)",
      borderBottom:   `1px solid ${colors.border}`,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      padding:        "0 30px",
      position:       "sticky",
      top:            0,
      zIndex:         40,
      backdropFilter: "blur(10px)",
    }}
  >
    {/* Page title */}
    <div style={{ fontFamily: fonts.display, fontSize: "1.1rem", letterSpacing: "0.08em", color: "#fff" }}>
      {NAV_LABELS[active]}
    </div>

    {/* Right info */}
    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
      <span style={{ fontSize: "0.78rem", color: colors.muted }}>
        {new Date().toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })}
      </span>

      <div style={{ width: "1px", height: "18px", background: colors.border }} />

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width:        "7px",
            height:       "7px",
            borderRadius: "50%",
            background:   "#2ecc71",
            boxShadow:    "0 0 8px rgba(46,204,113,0.7)",
            animation:    "pulse 2s infinite",
          }}
        />
        <span style={{ fontSize: "0.78rem", color: "#2ecc71", fontWeight: 600 }}>Live</span>
      </div>
    </div>
  </header>
);

export default TopBar;
