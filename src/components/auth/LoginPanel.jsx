// ─── LoginPanel ───────────────────────────────────────────────────────────────
// Sign-in form — validates credentials against MySQL via Laravel API.

import { useState } from "react";
import { colors, fonts } from "../../styles/tokens";
import { useApp }   from "../../AppContext";
import FocusInput from "../ui/FocusInput";
import PwInput    from "../ui/PwInput";
import BtnRed     from "../ui/BtnRed";
import FormAlert  from "../ui/FormAlert";

const LoginPanel = ({ onForgot, onSignup }) => {
  const { login } = useApp();
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !pw) { setErr("Please enter your email and password."); return; }
    setErr("");
    setLoading(true);
    try {
      await login(email, pw);
      // AppContext sets currentUser → App.jsx switches to dashboard automatically
    } catch (e) {
      setErr(e.message || "The email or password is incorrect or not registered.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <>
      <div style={{ fontFamily: fonts.display, fontSize: "1.9rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "6px" }}>
        Sign In
      </div>
      <p style={{ fontSize: "0.84rem", color: colors.muted, marginBottom: "26px" }}>
        Access your NYX Inventory dashboard
      </p>

      <FormAlert msg={err} />

      <FocusInput
        label="Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={handleKey}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <PwInput
        label="Password"
        value={pw}
        onChange={e => setPw(e.target.value)}
        onKeyDown={handleKey}
        placeholder="••••••••"
        autoComplete="current-password"
      />

      {/* Forgot password */}
      <div style={{ textAlign: "right", marginTop: "-6px", marginBottom: "14px" }}>
        <button onClick={onForgot} style={{ background: "none", border: "none", color: colors.muted, fontSize: "0.8rem", cursor: "pointer", fontFamily: fonts.body }}>
          Forgot password?
        </button>
      </div>

      {/* Remember me */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <input type="checkbox" defaultChecked style={{ accentColor: colors.red }} />
        <span style={{ fontSize: "0.82rem", color: colors.muted }}>Remember me for 30 days</span>
      </div>

      <BtnRed onClick={submit} disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </BtnRed>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
        <div style={{ flex: 1, height: "1px", background: colors.faint }} />
        <span style={{ fontSize: "0.72rem", color: colors.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>New to NYX?</span>
        <div style={{ flex: 1, height: "1px", background: colors.faint }} />
      </div>

      <div style={{ textAlign: "center", fontSize: "0.86rem", color: colors.muted }}>
        Don't have an account?{" "}
        <button onClick={onSignup} style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: fonts.body, fontSize: "inherit" }}>
          Create one now
        </button>
      </div>
    </>
  );
};

export default LoginPanel;
