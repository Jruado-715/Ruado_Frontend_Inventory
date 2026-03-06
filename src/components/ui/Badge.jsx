// ─── Badge ────────────────────────────────────────────────────────────────────
// Colored status pill used across tables and cards.
// Props: children (text), color ("green" | "yellow" | "red" | "blue" | "gray")

import { badge } from "../../styles/tokens";

const Badge = ({ children, color }) => {
  const s = badge[color] ?? badge.gray;

  return (
    <span
      style={{
        background:     s.bg,
        color:          s.color,
        padding:        "3px 10px",
        borderRadius:   "2px",
        fontSize:       "0.68rem",
        fontWeight:     700,
        letterSpacing:  "0.1em",
        textTransform:  "uppercase",
        whiteSpace:     "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
