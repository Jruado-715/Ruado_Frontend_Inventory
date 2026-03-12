// ─── StrengthBar ──────────────────────────────────────────────────────────────
// Visual password strength indicator shown below a password field.
// Props: pw (string)

import { colors } from "../../styles/tokens";

const LEVELS = [
  { w: "25%",  c: "#757575", t: "Weak"   },
  { w: "50%",  c: "#e67e22", t: "Fair"   },
  { w: "75%",  c: "#f1c40f", t: "Good"   },
  { w: "100%", c: "#27ae60", t: "Strong" },
];

const StrengthBar = ({ pw }) => {
  if (!pw) return null;

  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const level = LEVELS[Math.max(score - 1, 0)];

  return (
    <div style={{ marginTop: "6px" }}>
      <div
        style={{
          height:       "3px",
          background:   colors.faint,
          borderRadius: "2px",
          overflow:     "hidden",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            height:       "100%",
            width:        level.w,
            background:   level.c,
            borderRadius: "2px",
            transition:   "all 0.3s",
          }}
        />
      </div>
      <span style={{ fontSize: "0.72rem", color: level.c }}>
        Strength: {level.t}
      </span>
    </div>
  );
};

export default StrengthBar;
