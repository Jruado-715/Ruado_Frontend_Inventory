// ─── PwInput ──────────────────────────────────────────────────────────────────
// Password field with a SHOW / HIDE toggle button.
// Wraps FocusInput.

import { useState } from "react";
import { colors } from "../../styles/tokens";
import FocusInput from "./FocusInput";

const PwInput = ({ label, value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);

  return (
    <FocusInput
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
    >
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position:      "absolute",
          right:         "12px",
          top:           "50%",
          transform:     "translateY(-50%)",
          background:    "none",
          border:        "none",
          color:         colors.muted,
          cursor:        "pointer",
          fontFamily:    "'Barlow', sans-serif",
          fontSize:      "0.7rem",
          fontWeight:    700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {show ? "HIDE" : "SHOW"}
      </button>
    </FocusInput>
  );
};

export default PwInput;
