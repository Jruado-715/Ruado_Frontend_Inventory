// ─── ForgotPanel ──────────────────────────────────────────────────────────────
// Forgot password email form.
// Props: onBack(), onSent()

import { useState } from "react";
import { colors, fonts } from "../../styles/tokens";
import FocusInput from "../ui/FocusInput";
import BtnRed     from "../ui/BtnRed";
import FormAlert  from "../ui/FormAlert";

export const ForgotPanel = ({ onBack, onSent }) => {
  const [email, setEmail] = useState("");
  const [err,   setErr]   = useState("");

  const submit = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setErr("Please enter a valid email address."); return; }
    setErr("");
    onSent();
  };

  return (
    <>
      <div style={{ fontFamily: fonts.display, fontSize: "1.9rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "6px" }}>
        Reset Password
      </div>
      <p style={{ fontSize: "0.84rem", color: colors.muted, marginBottom: "26px" }}>
        Enter your email and we'll send a reset link to your inbox.
      </p>

      <FormAlert msg={err} />

      <FocusInput
        label="Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <BtnRed onClick={submit}>Send Reset Link</BtnRed>

      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: fonts.body, fontSize: "0.86rem" }}
        >
          ← Back to Sign In
        </button>
      </div>
    </>
  );
};

// ─── ForgotSuccess ────────────────────────────────────────────────────────────
// Confirmation screen shown after reset email is sent.
// Props: onBack()

export const ForgotSuccess = ({ onBack }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        width: "52px", height: "52px", borderRadius: "50%",
        background: "rgba(229,9,20,0.1)", border: `2px solid ${colors.red}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 18px", fontSize: "1.4rem",
      }}
    >
      ✉
    </div>

    <div style={{ fontFamily: fonts.display, fontSize: "1.9rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "10px" }}>
      Check Your Email
    </div>
    <p style={{ fontSize: "0.84rem", color: colors.muted, marginBottom: "24px" }}>
      We've sent a password reset link. It expires in 15 minutes.
    </p>

    <BtnRed onClick={onBack}>Back to Sign In</BtnRed>
  </div>
);
