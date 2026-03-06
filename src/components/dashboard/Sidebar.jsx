// ─── Sidebar ──────────────────────────────────────────────────────────────────
// Fixed left navigation panel for the dashboard.
// Props: user, active (key string), onNav(key), onLogout()

import { colors, fonts } from "../../styles/tokens";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "▦"  },
  { key: "products",  label: "Products",  icon: "📦" },
  { key: "users",     label: "Users",     icon: "👥" },
  { key: "orders",    label: "Orders",    icon: "🧾" },
  { key: "settings",  label: "Settings",  icon: "⚙️" },
];

const Sidebar = ({ user, active, onNav, onLogout }) => (
  <aside
    style={{
      width:       "230px",
      background:  "#0d0d0d",
      borderRight: `1px solid ${colors.border}`,
      display:     "flex",
      flexDirection: "column",
      position:    "fixed",
      top: 0, bottom: 0, left: 0,
      zIndex:      50,
      boxShadow:   "4px 0 24px rgba(0,0,0,0.6)",
    }}
  >
    {/* ── Logo ── */}
    <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ fontFamily: fonts.display, fontSize: "1.8rem", letterSpacing: "0.08em", color: colors.red, textShadow: `0 0 24px ${colors.redGlow}`, lineHeight: 1 }}>
        NYX
      </div>
      <div style={{ fontSize: "0.65rem", color: colors.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "2px" }}>
        Inventory System
      </div>
    </div>

    {/* ── User chip ── */}
    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: `linear-gradient(135deg, ${colors.red}, ${colors.redDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: fonts.display, fontSize: "0.88rem", color: "#fff", flexShrink: 0,
        }}
      >
        {(user.name || "A").slice(0, 2).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {user.name}
        </div>
        <div style={{ fontSize: "0.68rem", color: colors.red, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Admin User
        </div>
      </div>
    </div>

    {/* ── Nav links ── */}
    <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => onNav(item.key)}
          className={`sidebar-item ${active === item.key ? "active" : ""}`}
          style={{
            width:       "100%",
            display:     "flex",
            alignItems:  "center",
            gap:         "12px",
            padding:     "12px 20px",
            background:  "transparent",
            border:      "none",
            color:       active === item.key ? "#fff" : colors.muted,
            fontFamily:  fonts.body,
            fontSize:    "0.87rem",
            fontWeight:  600,
            cursor:      "pointer",
            textAlign:   "left",
            borderLeft:  "3px solid transparent",
          }}
        >
          <span style={{ fontSize: "1rem", width: "18px", textAlign: "center" }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>

    {/* ── Logout (pinned bottom) ── */}
    <div style={{ borderTop: `1px solid ${colors.border}` }}>
      <button
        onClick={onLogout}
        className="sidebar-item"
        style={{
          width:      "100%",
          display:    "flex",
          alignItems: "center",
          gap:        "12px",
          padding:    "14px 20px",
          background: "transparent",
          border:     "none",
          color:      "#555",
          fontFamily: fonts.body,
          fontSize:   "0.87rem",
          fontWeight: 600,
          cursor:     "pointer",
          textAlign:  "left",
          borderLeft: "3px solid transparent",
        }}
      >
        <span style={{ fontSize: "1rem", width: "18px", textAlign: "center" }}>⏻</span>
        Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;
