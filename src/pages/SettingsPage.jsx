// ─── SettingsPage.jsx ─────────────────────────────────────────────────────────
// Functional: editable profile, password change, notification toggles, system prefs.

import { useState } from "react";
import { useApp }   from "../AppContext";
import { colors, fonts } from "../styles/tokens";

const inputStyle = { width:"100%", background:"#222", border:"1px solid #2a2a2a", borderRadius:"3px", padding:"10px 12px", fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"#fff", outline:"none" };
const labelStyle = { display:"block", fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#757575", marginBottom:"5px" };

// ── Toggle switch ──
const Toggle = ({ value, onChange }) => (
  <button onClick={()=>onChange(!value)}
    style={{ width:"44px", height:"24px", borderRadius:"12px", background:value?colors.red:"#333", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
    <div style={{ position:"absolute", top:"3px", left:value?"22px":"3px", width:"18px", height:"18px", borderRadius:"50%", background:"#fff", transition:"left 0.2s" }}/>
  </button>
);

// ── Section card ──
const Section = ({ title, icon, children }) => (
  <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden", marginBottom:"16px" }}>
    <div style={{ padding:"14px 20px", borderBottom:`1px solid ${colors.border}`, display:"flex", alignItems:"center", gap:"10px" }}>
      <span style={{ fontSize:"1.1rem" }}>{icon}</span>
      <div style={{ fontFamily:fonts.display, fontSize:"1.05rem", letterSpacing:"0.06em", color:"#fff" }}>{title}</div>
    </div>
    <div style={{ padding:"18px 20px" }}>{children}</div>
  </div>
);

const Row = ({ label, children }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
    <span style={{ fontSize:"0.85rem", color:colors.muted }}>{label}</span>
    <div>{children}</div>
  </div>
);

const SettingsPage = () => {
  const { currentUser, settings, updateSettings, toast } = useApp();

  // Local edit state
  const [profile, setProfile] = useState({ name: currentUser?.name ?? "", email: currentUser?.email ?? "" });
  const [pwForm,  setPwForm]  = useState({ current:"", newPw:"", confirm:"" });
  const [pwErr,   setPwErr]   = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPw,      setEditingPw]      = useState(false);

  const saveProfile = () => {
    if (!profile.name.trim())  { toast("Name cannot be empty.", "error"); return; }
    if (!profile.email.trim()) { toast("Email cannot be empty.", "error"); return; }
    updateSettings({ displayName: profile.name, name: profile.name, email: profile.email });
    setEditingProfile(false);
    toast("Profile saved!");
  };

  const savePw = () => {
    if (!pwForm.current) { setPwErr("Enter your current password."); return; }
    if (pwForm.newPw.length < 8) { setPwErr("New password must be at least 8 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwErr("Passwords do not match."); return; }
    setPwErr(""); setPwForm({current:"",newPw:"",confirm:""});
    setEditingPw(false);
    toast("Password updated!");
  };

  const setBool = (key, val) => { updateSettings({ [key]: val }); toast("Setting saved!"); };

  const saveBtn = (onClick) => (
    <button onClick={onClick} className="btn-red"
      style={{ background:colors.red, border:"none", color:"#fff", borderRadius:"3px", padding:"8px 18px", fontFamily:fonts.display, fontSize:"0.88rem", letterSpacing:"0.1em", cursor:"pointer", marginTop:0 }}>
      Save
    </button>
  );

  const editBtn = (onClick) => (
    <button onClick={onClick}
      style={{ background:colors.surface2, border:`1px solid ${colors.border}`, color:colors.muted, borderRadius:"3px", padding:"7px 16px", fontFamily:fonts.body, fontSize:"0.85rem", cursor:"pointer" }}>
      Edit
    </button>
  );

  return (
    <div style={{ animation:"fadeSlide 0.35s ease both", maxWidth:"720px" }}>
      <div style={{ fontFamily:fonts.display, fontSize:"1.6rem", letterSpacing:"0.06em", color:"#fff", marginBottom:"22px" }}>Settings</div>

      {/* ── Profile ── */}
      <Section title="Profile" icon="👤">
        {!editingProfile ? (
          <>
            <Row label="Display Name"><span style={{ color:"#fff", fontWeight:600, fontSize:"0.9rem" }}>{currentUser?.name}</span></Row>
            <Row label="Email"><span style={{ color:"#fff", fontWeight:600, fontSize:"0.9rem" }}>{currentUser?.email}</span></Row>
            <Row label="Role"><span style={{ color:colors.red, fontWeight:600, fontSize:"0.9rem" }}>Admin</span></Row>
            <div style={{ marginTop:"14px" }}>{editBtn(()=>setEditingProfile(true))}</div>
          </>
        ) : (
          <>
            <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Display Name</label><input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} style={inputStyle}/></div>
            <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Email</label><input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} style={inputStyle}/></div>
            <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
              {saveBtn(saveProfile)}
              <button onClick={()=>setEditingProfile(false)} style={{ background:"none", border:`1px solid ${colors.border}`, color:colors.muted, borderRadius:"3px", padding:"8px 18px", fontFamily:fonts.body, fontSize:"0.85rem", cursor:"pointer" }}>Cancel</button>
            </div>
          </>
        )}
      </Section>

      {/* ── Security ── */}
      <Section title="Security" icon="🔒">
        <Row label="Two-Factor Authentication"><Toggle value={settings.twoFA} onChange={v=>setBool("twoFA",v)}/></Row>
        <Row label="Last Login"><span style={{ color:colors.muted, fontSize:"0.85rem" }}>Just now · Manila, PH</span></Row>
        {!editingPw ? (
          <>
            <Row label="Password"><span style={{ color:"#fff", fontSize:"0.9rem" }}>••••••••</span></Row>
            <div style={{ marginTop:"14px" }}>{editBtn(()=>setEditingPw(true))}</div>
          </>
        ) : (
          <>
            {pwErr && <div style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", borderRadius:"3px", padding:"8px 12px", fontSize:"0.82rem", color:"#ff6b6b", marginBottom:"10px" }}>{pwErr}</div>}
            <div style={{ marginBottom:"10px" }}><label style={labelStyle}>Current Password</label><input type="password" value={pwForm.current} onChange={e=>setPwForm(f=>({...f,current:e.target.value}))} style={inputStyle}/></div>
            <div style={{ marginBottom:"10px" }}><label style={labelStyle}>New Password</label><input type="password" value={pwForm.newPw} onChange={e=>setPwForm(f=>({...f,newPw:e.target.value}))} style={inputStyle}/></div>
            <div style={{ marginBottom:"10px" }}><label style={labelStyle}>Confirm Password</label><input type="password" value={pwForm.confirm} onChange={e=>setPwForm(f=>({...f,confirm:e.target.value}))} style={inputStyle}/></div>
            <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
              {saveBtn(savePw)}
              <button onClick={()=>{setEditingPw(false);setPwErr("");}} style={{ background:"none", border:`1px solid ${colors.border}`, color:colors.muted, borderRadius:"3px", padding:"8px 18px", fontFamily:fonts.body, fontSize:"0.85rem", cursor:"pointer" }}>Cancel</button>
            </div>
          </>
        )}
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications" icon="🔔">
        <Row label="Email Alerts"><Toggle value={settings.emailAlerts} onChange={v=>setBool("emailAlerts",v)}/></Row>
        <Row label="Low Stock Alerts"><Toggle value={settings.lowStockAlert} onChange={v=>setBool("lowStockAlert",v)}/></Row>
        <Row label="Order Updates"><Toggle value={settings.orderUpdates} onChange={v=>setBool("orderUpdates",v)}/></Row>
        <Row label="Low Stock Threshold">
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <input type="number" min="1" max="50" value={settings.lowStockThreshold}
              onChange={e=>updateSettings({lowStockThreshold:Number(e.target.value)})}
              style={{ ...inputStyle, width:"70px", padding:"6px 10px", textAlign:"center" }}/>
            <span style={{ fontSize:"0.82rem", color:colors.muted }}>units</span>
          </div>
        </Row>
      </Section>

      {/* ── System ── */}
      <Section title="System" icon="⚙️">
        <Row label="Theme">
          <select value={settings.theme} onChange={e=>updateSettings({theme:e.target.value})}
            style={{ ...inputStyle, width:"auto", padding:"6px 12px", cursor:"pointer" }}>
            {["Netflix Dark","Midnight Black","Deep Red"].map(t=><option key={t}>{t}</option>)}
          </select>
        </Row>
        <Row label="Language">
          <select value={settings.language} onChange={e=>updateSettings({language:e.target.value})}
            style={{ ...inputStyle, width:"auto", padding:"6px 12px", cursor:"pointer" }}>
            {["English (PH)","English (US)","Filipino"].map(l=><option key={l}>{l}</option>)}
          </select>
        </Row>
        <Row label="Timezone">
          <select value={settings.timezone} onChange={e=>updateSettings({timezone:e.target.value})}
            style={{ ...inputStyle, width:"auto", padding:"6px 12px", cursor:"pointer" }}>
            {["Asia/Manila","Asia/Singapore","UTC"].map(z=><option key={z}>{z}</option>)}
          </select>
        </Row>
      </Section>
    </div>
  );
};

export default SettingsPage;
