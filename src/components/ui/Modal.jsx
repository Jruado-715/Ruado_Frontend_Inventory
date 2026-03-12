// ─── Modal.jsx ────────────────────────────────────────────────────────────────
// Overlay modal wrapper. Closes on backdrop click.
// Props: title, onClose, children, width (optional)

import { colors, fonts } from "../../styles/tokens";

const Modal = ({ title, onClose, children, width = "480px" }) => (
  <div
    onClick={onClose}
    style={{
      position:       "fixed",
      inset:          0,
      background:     "rgba(0,0,0,0.75)",
      zIndex:         1000,
      display:        "flex",
      alignItems:     "flex-start",
      paddingTop:     "1px",
      justifyContent: "center",
      padding:        "1px",
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        width,
        maxWidth:     "100%",
        background:   "#1a1a1a",
        border:       `1px solid ${colors.border}`,
        borderRadius: "6px",
        boxShadow:    "0 24px 60px rgba(0,0,0,0.8)",
        animation:    "cardIn 0.25s ease both",
        overflow:     "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          padding:        "16px 22px",
          borderBottom:   `1px solid ${colors.border}`,
          background:     "rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontFamily: fonts.display, fontSize: "1.1rem", letterSpacing: "0.06em", color: "#fff" }}>
          {title}
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: colors.muted, cursor: "pointer", fontSize: "1.2rem", lineHeight: 1, padding: "2px 6px" }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "22px" }}>
        {children}
      </div>
    </div>
  </div>
);

export default Modal;
