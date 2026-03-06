// ─── SignupPanel ──────────────────────────────────────────────────────────────
// Registration form — saves user to MySQL via Laravel API,
// then redirects back to the login page.

import { useState } from "react";
import { colors, fonts } from "../../styles/tokens";
import { useApp }    from "../../AppContext";
import FocusInput    from "../ui/FocusInput";
import PwInput       from "../ui/PwInput";
import StrengthBar   from "../ui/StrengthBar";
import BtnRed        from "../ui/BtnRed";
import FormAlert     from "../ui/FormAlert";

const SignupPanel = ({ onLogin }) => {
  const { register, toast } = useApp();
  const [fname,   setFname]   = useState("");
  const [lname,   setLname]   = useState("");
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [pw2,     setPw2]     = useState("");
  const [terms,   setTerms]   = useState(false);
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!fname || !lname || !email || !pw || !pw2) { setErr("Please fill in all required fields."); return; }
    if (pw !== pw2)    { setErr("Passwords do not match."); return; }
    if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (!terms)        { setErr("You must agree to the Terms of Service."); return; }

    setErr("");
    setLoading(true);
    try {
      await register(`${fname} ${lname}`, email, pw, pw2);
      toast("Account created! Please sign in.", "success");
      onLogin(); // redirect to login page
    } catch (e) {
      setErr(e.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ fontFamily: fonts.display, fontSize: "1.9rem", letterSpacing: "0.06em", color: "#fff", marginBottom: "6px" }}>
        Create Account
      </div>
      <p style={{ fontSize: "0.84rem", color: colors.muted, marginBottom: "26px" }}>
        Start managing your inventory with NYX
      </p>

      <FormAlert msg={err} />

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <FocusInput label="First Name" value={fname} onChange={e => setFname(e.target.value)} placeholder="John" />
        <FocusInput label="Last Name"  value={lname} onChange={e => setLname(e.target.value)} placeholder="Doe"  />
      </div>

      <FocusInput label="Email Address" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />

      {/* Password + strength */}
      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.muted, marginBottom: "5px" }}>
          Password
        </label>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Min. 8 characters"
          style={{ width: "100%", background: colors.surface2, border: `1px solid ${colors.faint}`, borderRadius: "3px", padding: "13px 14px", fontFamily: fonts.body, fontSize: "0.93rem", color: "#fff", outline: "none" }}
        />
        <StrengthBar pw={pw} />
      </div>

      <PwInput label="Confirm Password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="••••••••" autoComplete="new-password" />

      {/* Terms */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ accentColor: colors.red }} />
        <span style={{ fontSize: "0.82rem", color: colors.muted }}>
          I agree to the <span style={{ color: colors.red }}>Terms of Service</span>
        </span>
      </div>

      <BtnRed onClick={submit} disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </BtnRed>

      <div style={{ textAlign: "center", fontSize: "0.86rem", color: colors.muted, marginTop: "20px" }}>
        Already have an account?{" "}
        <button onClick={onLogin} style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: fonts.body, fontSize: "inherit" }}>
          Sign in
        </button>
      </div>
    </>
  );
};

export default SignupPanel;
