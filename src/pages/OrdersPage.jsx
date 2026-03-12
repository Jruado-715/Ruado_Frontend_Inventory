// ─── OrdersPage.jsx ───────────────────────────────────────────────────────────
// Functional: filter by status, change order status inline, add order, delete order.

import { useState } from "react";
import { useApp }   from "../AppContext";
import { colors, fonts } from "../styles/tokens";
import Badge         from "../components/ui/Badge";
import StatCard      from "../components/dashboard/StatCard";
import Modal         from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const STATUSES     = ["All","Pending","Processing","Shipped","Delivered"];
const STATUS_COLOR = { Delivered:"green", Shipped:"blue", Processing:"yellow", Pending:"gray" };
const STATUS_NEXT  = { Pending:"Processing", Processing:"Shipped", Shipped:"Delivered", Delivered:"Delivered" };
const COLS         = ["Order ID","Customer","Product","Qty","Total","Status","Time","Actions"];

const inputStyle = { width:"100%", background:"#222", border:"1px solid #2a2a2a", borderRadius:"3px", padding:"10px 12px", fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"#fff", outline:"none" };
const labelStyle = { display:"block", fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#757575", marginBottom:"5px" };

// ── New Order Form ──
const OrderForm = ({ products, onSave, onCancel }) => {
  const [form, setForm] = useState({ customer:"", product: products[0]?.name ?? "", qty:"1" });
  const [err,  setErr]  = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = () => {
    if (!form.customer.trim()) { setErr("Customer name is required."); return; }
    if (!form.qty || isNaN(form.qty) || Number(form.qty)<1) { setErr("Enter a valid quantity."); return; }
    const prod  = products.find(p=>p.name===form.product);
    const total = prod ? prod.price * Number(form.qty) : 0;
    setErr(""); onSave({ ...form, qty: Number(form.qty), total });
  };

  return (
    <div>
      {err && <div style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", borderRadius:"3px", padding:"8px 12px", fontSize:"0.82rem", color:"#ff6b6b", marginBottom:"14px" }}>{err}</div>}
      <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Customer Name *</label><input value={form.customer} onChange={e=>set("customer",e.target.value)} placeholder="Full name" style={inputStyle}/></div>
      <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Product *</label>
        <select value={form.product} onChange={e=>set("product",e.target.value)} style={{...inputStyle,cursor:"pointer"}}>
          {products.map(p=><option key={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:"12px" }}><label style={labelStyle}>Quantity *</label><input type="number" min="1" value={form.qty} onChange={e=>set("qty",e.target.value)} placeholder="1" style={inputStyle}/></div>
      <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"8px" }}>
        <button onClick={onCancel} style={{ background:"none", border:`1px solid ${colors.border}`, color:colors.muted, borderRadius:"3px", padding:"9px 20px", fontFamily:fonts.body, fontSize:"0.87rem", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} className="btn-red" style={{ background:colors.red, border:"none", color:"#fff", borderRadius:"3px", padding:"9px 22px", fontFamily:fonts.display, fontSize:"0.95rem", letterSpacing:"0.1em", cursor:"pointer", marginTop:0 }}>Place Order</button>
      </div>
    </div>
  );
};

// ── Main ──
const OrdersPage = () => {
  const { orders, products, addOrder, updateOrderStatus, deleteOrder, toast } = useApp();
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(false);
  const [confirm, setConfirm] = useState(null);

  const filtered = orders.filter(o => {
    const ms = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="All" || o.status===filter;
    return ms && mf;
  });

  const counts = [
    { label:"Total Orders",  value:orders.length,                                       color:"#fff",    icon:"🧾", sub:"All time"   },
    { label:"Processing",    value:orders.filter(o=>o.status==="Processing").length,     color:"#f1c40f", icon:"⏳", sub:"In progress"},
    { label:"Shipped",       value:orders.filter(o=>o.status==="Shipped").length,        color:"#3498db", icon:"🚚", sub:"On the way" },
    { label:"Delivered",     value:orders.filter(o=>o.status==="Delivered").length,      color:"#2ecc71", icon:"✅", sub:"Completed"  },
  ];

  const advance = (id, status) => {
    const next = STATUS_NEXT[status];
    if (next !== status) { updateOrderStatus(id, next); toast(`Order moved to ${next}`); }
  };

  const handleAdd = (form) => { addOrder(form); setModal(false); toast("Order placed!"); };
  const handleDel = () => { deleteOrder(confirm); setConfirm(null); toast("Order removed.", "error"); };

  return (
    <div style={{ animation:"fadeSlide 0.35s ease both" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"22px" }}>
        <div>
          <div style={{ fontFamily:fonts.display, fontSize:"1.6rem", letterSpacing:"0.06em", color:"#fff" }}>Orders</div>
          <div style={{ fontSize:"0.83rem", color:colors.muted }}>{orders.length} total orders</div>
        </div>
        <button onClick={()=>setModal(true)} className="btn-red" style={{ background:colors.red, color:"#fff", border:"none", borderRadius:"3px", padding:"9px 20px", fontFamily:fonts.display, fontSize:"0.95rem", letterSpacing:"0.1em", cursor:"pointer" }}>
          + New Order
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"22px" }}>
        {counts.map((s,i)=><StatCard key={s.label} {...s} delay={i*0.07}/>)}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders…"
          style={{ background:colors.surface2, border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"8px 14px", fontFamily:fonts.body, fontSize:"0.87rem", color:"#fff", outline:"none", width:"220px" }} />
        <div style={{ display:"flex", gap:"6px" }}>
          {STATUSES.map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              style={{ background:filter===s?colors.red:colors.surface2, border:`1px solid ${filter===s?colors.red:colors.border}`, color:filter===s?"#fff":colors.muted, borderRadius:"3px", padding:"7px 14px", fontFamily:fonts.body, fontSize:"0.82rem", cursor:"pointer", fontWeight:600 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"rgba(0,0,0,0.3)" }}>
            {COLS.map(h=><th key={h} style={{ textAlign:"left", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:colors.muted, padding:"10px 14px", borderBottom:`1px solid ${colors.border}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={8} style={{ padding:"40px", textAlign:"center", color:colors.muted }}>No orders found</td></tr>
              : filtered.map(o=>(
                <tr key={o.id} className="order-row">
                  <td style={{ padding:"11px 14px", color:colors.red, fontWeight:700, fontSize:"0.82rem", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.id}</td>
                  <td style={{ padding:"11px 14px", color:"#fff", fontWeight:600, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.customer}</td>
                  <td style={{ padding:"11px 14px", color:colors.muted, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.product}</td>
                  <td style={{ padding:"11px 14px", color:"#ccc", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.qty}</td>
                  <td style={{ padding:"11px 14px", color:"#fff", fontWeight:700, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>${o.total}</td>
                  <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}><Badge color={STATUS_COLOR[o.status]??"gray"}>{o.status}</Badge></td>
                  <td style={{ padding:"11px 14px", color:colors.muted, fontSize:"0.78rem", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{o.time}</td>
                  <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display:"flex", gap:"6px" }}>
                      {o.status!=="Delivered" && (
                        <button onClick={()=>advance(o.id,o.status)}
                          style={{ background:"rgba(52,152,219,0.15)", border:"1px solid rgba(52,152,219,0.3)", color:"#3498db", borderRadius:"3px", padding:"4px 10px", cursor:"pointer", fontSize:"0.75rem", fontFamily:fonts.body, whiteSpace:"nowrap" }}>
                          → {STATUS_NEXT[o.status]}
                        </button>
                      )}
                      <button onClick={()=>setConfirm(o.id)}
                        style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", color:colors.red, borderRadius:"3px", padding:"4px 10px", cursor:"pointer", fontSize:"0.75rem", fontFamily:fonts.body }}>
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {modal   && <Modal title="New Order" onClose={()=>setModal(false)}><OrderForm products={products} onSave={handleAdd} onCancel={()=>setModal(false)}/></Modal>}
      {confirm && <ConfirmDialog message="Delete this order? This cannot be undone." onConfirm={handleDel} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
};

export default OrdersPage;
