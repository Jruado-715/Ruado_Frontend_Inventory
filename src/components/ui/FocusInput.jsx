// ─── FocusInput ───────────────────────────────────────────────────────────────
// Labeled text input that highlights red on focus.
// Props: label, type, value, onChange, placeholder, autoComplete, children (slot for pw toggle)

import { useState } from "react";
import { colors, fonts } from "../../styles/tokens";

const FocusInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  children,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: "14px" }}>
      {label && (
        <label
          style={{
            display:       "block",
            fontSize:      "0.7rem",
            fontWeight:    700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         focused ? colors.red : colors.muted,
            marginBottom:  "5px",
            transition:    "color 0.2s",
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:       "100%",
            background:  colors.surface2,
            border:      `1px solid ${focused ? colors.red : colors.faint}`,
            borderRadius:"3px",
            padding:     "13px 14px",
            fontFamily:  fonts.body,
            fontSize:    "0.93rem",
            color:       "#fff",
            outline:     "none",
            boxShadow:   focused ? `0 0 0 2px ${colors.redGlow}` : "none",
            transition:  "all 0.2s",
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default FocusInput;
