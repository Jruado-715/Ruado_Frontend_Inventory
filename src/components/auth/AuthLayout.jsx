// ─── AuthLayout ───────────────────────────────────────────────────────────────
// Full-page wrapper for all auth screens (Login, Signup, Forgot Password).
// Renders the NYX logo nav, centered card, and footer.

import { colors, fonts } from "../../styles/tokens";

const AuthLayout = ({ children }) => (
  <div
    style={{
      minHeight:       "100vh",
      display:         "flex",
      flexDirection:   "column",
      background:      "#0a0a0a",
      backgroundImage: "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(229,9,20,0.14) 0%, transparent 60%)",
    }}
  >
    {/* ── Nav ── */}
    <nav
      style={{
        padding:    "22px 48px",
        background: "rgba(0,0,0,0.7)",
        display:    "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily:  fonts.display,
          fontSize:    "2.2rem",
          letterSpacing: "0.08em",
          color:       colors.red,
          textShadow:  `0 0 30px ${colors.redGlow}`,
        }}
      >
        NYX<span style={{ color: "#fff", opacity: 0.9 }}> Inventory</span>
      </div>
    </nav>

    {/* ── Card ── */}
    <div
      style={{
        flex:           1,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "40px 20px",
      }}
    >
      <div
        style={{
          width:        "100%",
          maxWidth:     "440px",
          background:   "rgba(0,0,0,0.85)",
          border:       "1px solid rgba(229,9,20,0.15)",
          borderRadius: "4px",
          padding:      "48px 52px 56px",
          boxShadow:    "0 20px 60px rgba(0,0,0,0.8)",
          position:     "relative",
          animation:    "cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* red top accent line */}
        <div
          style={{
            position:     "absolute",
            top: 0, left: 0, right: 0,
            height:       "2px",
            background:   "linear-gradient(90deg,transparent,#E50914,transparent)",
            borderRadius: "4px 4px 0 0",
          }}
        />
        {children}
      </div>
    </div>

    {/* ── Footer ── */}
    <footer
      style={{
        padding:     "18px",
        textAlign:   "center",
        borderTop:   `1px solid ${colors.border}`,
      }}
    >
      <span style={{ fontSize: "0.74rem", color: "#333" }}>
        © 2025 NYX Inventory · All rights reserved
      </span>
    </footer>
  </div>
);

export default AuthLayout;
