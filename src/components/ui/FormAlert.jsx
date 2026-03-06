// ─── FormAlert ────────────────────────────────────────────────────────────────
// Inline red alert shown on form validation errors.
// Props: msg (string | null) — renders nothing when falsy

const FormAlert = ({ msg }) => {
  if (!msg) return null;

  return (
    <div
      style={{
        background:    "rgba(229,9,20,0.1)",
        border:        "1px solid rgba(229,9,20,0.3)",
        borderRadius:  "3px",
        padding:       "9px 13px",
        fontSize:      "0.82rem",
        color:         "#ff6b6b",
        marginBottom:  "14px",
      }}
    >
      {msg}
    </div>
  );
};

export default FormAlert;
