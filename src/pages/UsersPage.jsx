// ─── UsersPage.jsx ────────────────────────────────────────────────────────────
// Functional: add user, edit role/name, delete user, search.

import { useState } from "react";
import { useApp }   from "../AppContext";
import { colors, fonts } from "../styles/tokens";
import Badge         from "../components/ui/Badge";
import Modal         from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const ROLES = ["Customer","Admin","Manager"];
const inputStyle = { width:"100%", background:"#222", border:"1px solid #2a2a2a", borderRadius:"3px", padding:"10px 12px", fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"#fff", outline:"none" };
const labelStyle = { display:"block", fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#757575", marginBottom:"5px" };

// ── User Form ──
const UserForm = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: initial.name ?? "", email: initial.email ?? "", role: initial.role ?? "Customer" });
  const [err,  setErr]  = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = () => {
    if (!form.name.trim())  { setErr("Name is required."); return; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setErr("Valid email is required."); return; }
    setErr(""); onSave(form);
  };

  return (
    <div>
      {err && <div style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", borderRadius:"3px", padding:"8px 12px", fontSize:"0.82rem", color:"#ff6b6b", marginBottom:"14px" }}>{err}</div>}
      <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Full Name *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="First Last" style={inputStyle}/></div>
      <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Email *</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="user@example.com" style={inputStyle}/></div>
      <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Role</label>
        <select value={form.role} onChange={e=>set("role",e.target.value)} style={{...inputStyle,cursor:"pointer"}}>
          {ROLES.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"8px" }}>
        <button onClick={onCancel} style={{ background:"none", border:`1px solid ${colors.border}`, color:colors.muted, borderRadius:"3px", padding:"9px 20px", fontFamily:fonts.body, fontSize:"0.87rem", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} className="btn-red" style={{ background:colors.red, border:"none", color:"#fff", borderRadius:"3px", padding:"9px 22px", fontFamily:fonts.display, fontSize:"0.95rem", letterSpacing:"0.1em", cursor:"pointer", marginTop:0 }}>
          {initial.id ? "Save Changes" : "Add User"}
        </button>
      </div>
    </div>
  );
};

// ── Main ──
const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser, toast } = useApp();
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd  = (form) => { addUser(form); setModal(null); toast("User added!"); };
  const handleEdit = (form) => { updateUser(modal.user.id, form); setModal(null); toast("User updated!"); };
  const handleDel  = () => { deleteUser(confirm); setConfirm(null); toast("User removed.", "error"); };

  return (
    <div style={{ animation:"fadeSlide 0.35s ease both" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"22px" }}>
        <div>
          <div style={{ fontFamily:fonts.display, fontSize:"1.6rem", letterSpacing:"0.06em", color:"#fff" }}>Users</div>
          <div style={{ fontSize:"0.83rem", color:colors.muted }}>{users.length} registered users</div>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…"
            style={{ background:colors.surface2, border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"8px 14px", fontFamily:fonts.body, fontSize:"0.87rem", color:"#fff", outline:"none", width:"200px" }}/>
          <button onClick={()=>setModal("add")} className="btn-red" style={{ background:colors.red, color:"#fff", border:"none", borderRadius:"3px", padding:"8px 18px", fontFamily:fonts.display, fontSize:"0.95rem", letterSpacing:"0.1em", cursor:"pointer" }}>
            + Add User
          </button>
        </div>
      </div>

      {/* Cards */}
      {filtered.length===0
        ? <div style={{ textAlign:"center", padding:"60px", color:colors.muted }}><div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>👥</div>No users found</div>
        : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"14px" }}>
            {filtered.map((u,i)=>(
              <div key={u.id} className="stat-card"
                style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", padding:"20px", animation:`cardIn 0.4s ${i*0.07}s both`, position:"relative" }}>
                {/* Actions */}
                <div style={{ position:"absolute", top:"12px", right:"12px", display:"flex", gap:"4px" }}>
                  <button onClick={()=>setModal({type:"edit",user:u})} style={{ background:"rgba(52,152,219,0.15)", border:"1px solid rgba(52,152,219,0.3)", color:"#3498db", borderRadius:"3px", padding:"3px 8px", cursor:"pointer", fontSize:"0.72rem", fontFamily:fonts.body }}>Edit</button>
                  <button onClick={()=>setConfirm(u.id)} style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", color:colors.red, borderRadius:"3px", padding:"3px 8px", cursor:"pointer", fontSize:"0.72rem", fontFamily:fonts.body }}>Del</button>
                </div>

                {/* Avatar + name */}
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
                  <div style={{ width:"42px", height:"42px", borderRadius:"50%", background:`linear-gradient(135deg,${colors.red},${colors.redDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:fonts.display, fontSize:"0.95rem", color:"#fff", flexShrink:0 }}>
                    {u.avatar}
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:700, color:"#fff", fontSize:"0.9rem", paddingRight:"70px" }}>{u.name}</div>
                    <div style={{ fontSize:"0.76rem", color:colors.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"0.66rem", textTransform:"uppercase", letterSpacing:"0.1em", color:colors.muted }}>Joined</div>
                    <div style={{ fontSize:"0.8rem", color:"#ccc", marginTop:"2px" }}>{u.joined}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"0.66rem", textTransform:"uppercase", letterSpacing:"0.1em", color:colors.muted }}>Orders</div>
                    <div style={{ fontFamily:fonts.display, fontSize:"1.3rem", color:colors.red }}>{u.orders}</div>
                  </div>
                  <Badge color={u.role==="Admin"?"red":u.role==="Manager"?"blue":"gray"}>{u.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal==="add"        && <Modal title="Add New User" onClose={()=>setModal(null)}><UserForm onSave={handleAdd} onCancel={()=>setModal(null)}/></Modal>}
      {modal?.type==="edit" && <Modal title="Edit User" onClose={()=>setModal(null)}><UserForm initial={modal.user} onSave={handleEdit} onCancel={()=>setModal(null)}/></Modal>}
      {confirm              && <ConfirmDialog message={`Remove "${users.find(u=>u.id===confirm)?.name}"? This cannot be undone.`} onConfirm={handleDel} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
};

export default UsersPage;
