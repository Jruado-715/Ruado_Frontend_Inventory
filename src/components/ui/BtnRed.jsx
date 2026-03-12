// ─── BtnRed ───────────────────────────────────────────────────────────────────
// Primary action button in Netflix red.
// Props: children, onClick, full (boolean – 100% width, default true)

import { colors, fonts } from "../../styles/tokens";

const BtnRed = ({ children, onClick, full = true, style = {} }) => (
  <button
    className="btn-red"
    onClick={onClick}
    style={{
      width:          full ? "100%" : "auto",
      background:     colors.red,
      color:          "#fff",
      border:         "none",
      borderRadius:   "3px",
      padding:        "14px 20px",
      fontFamily:     fonts.display,
      fontSize:       "1.05rem",
      letterSpacing:  "0.12em",
      cursor:         "pointer",
      marginTop:      "6px",
      ...style,
    }}
  >
    {children}
  </button>
);

export default BtnRed;
