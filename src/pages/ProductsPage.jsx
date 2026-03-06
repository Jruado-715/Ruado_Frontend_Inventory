// ─── ProductsPage.jsx ─────────────────────────────────────────────────────────
// Full CRUD with search, filter, sort — all connected to MySQL via Laravel API.

import { useState } from "react";
import { useApp }   from "../AppContext";
import { colors, fonts } from "../styles/tokens";
import Badge         from "../components/ui/Badge";
import Modal         from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";


const CATEGORIES = ["All", "Electronics", "Furniture", "Peripherals"];
const EMOJIS     = ["💻","🖥️","⌨️","🖱️","📷","🔌","🪑","🪵","📦","🖨️","📱","🎧"];
const EMOJI_NAMES = ["Laptop","Desktop Monitor","Keyboard","Mouse","Camera","Cable/Charger","Chair","Desk","Box/Package","Printer","Phone","Headphones"];

const SORT_OPTIONS = [
  { value: "",         label: "Default"     },
  { value: "name_asc", label: "Name A–Z"   },
  { value: "name_desc",label: "Name Z–A"   },
  { value: "price_asc",label: "Price ↑"    },
  { value: "price_desc",label:"Price ↓"    },
  { value: "stock_asc",label: "Stock ↑"    },
  { value: "stock_desc",label:"Stock ↓"    },
];

const stockColor = n => n < 4 ? "red" : n < 10 ? "yellow" : "green";
const stockLabel = n => n < 4 ? "Critical" : n < 10 ? "Low" : "In Stock";

const inputStyle = { width:"100%", background:"#222", border:"1px solid #2a2a2a", borderRadius:"3px", padding:"10px 12px", fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"#fff", outline:"none" };
const labelStyle = { display:"block", fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#757575", marginBottom:"5px" };

// ── Product Form ──
const ProductForm = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: initial.name ?? "", category: initial.category ?? "Electronics", stock: initial.stock ?? "", price: initial.price ?? "", img: initial.img ?? "📦" });
  const [err, setErr]   = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim())               { setErr("Product name is required."); return; }
    if (!form.stock || isNaN(form.stock)) { setErr("Enter a valid stock number."); return; }
    if (!form.price || isNaN(form.price)) { setErr("Enter a valid price."); return; }
    setErr(""); onSave(form);
  };

  return (
    <div>
      {err && <div style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", borderRadius:"3px", padding:"8px 12px", fontSize:"0.82rem", color:"#ff6b6b", marginBottom:"14px" }}>{err}</div>}
      <div style={{ marginBottom:"14px" }}>
        <label style={labelStyle}>Icon</label>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {EMOJIS.map((e, i) => <button key={e} title={EMOJI_NAMES[i]} onClick={() => set("img", e)} style={{ fontSize:"1.3rem", background: form.img===e ? "rgba(229,9,20,0.2)" : "#222", border:`1px solid ${form.img===e ? "#E50914" : "#2a2a2a"}`, borderRadius:"4px", padding:"4px 8px", cursor:"pointer" }}>{e}</button>)}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
        <div><label style={labelStyle}>Product Name *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Laptop Pro" style={inputStyle}/></div>
        <div><label style={labelStyle}>Category *</label>
          <select value={form.category} onChange={e=>set("category",e.target.value)} style={{...inputStyle,cursor:"pointer"}}>
            {["Electronics","Furniture","Peripherals"].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Stock Qty *</label><input type="number" min="0" value={form.stock} onChange={e=>set("stock",e.target.value)} placeholder="0" style={inputStyle}/></div>
        <div><label style={labelStyle}>Price (PHP) *</label><input type="number" min="0" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="0.00" style={inputStyle}/></div>
      </div>
      <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", marginTop:"8px" }}>
        <button onClick={onCancel} style={{ background:"none", border:`1px solid ${colors.border}`, color:colors.muted, borderRadius:"3px", padding:"9px 20px", fontFamily:fonts.body, fontSize:"0.87rem", cursor:"pointer" }}>Cancel</button>
        <button onClick={submit} className="btn-red" style={{ background:colors.red, border:"none", color:"#fff", borderRadius:"3px", padding:"9px 22px", fontFamily:fonts.display, fontSize:"0.95rem", letterSpacing:"0.1em", cursor:"pointer", marginTop:0 }}>
          {initial.id ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );
};

// ── Main ──
const ProductsPage = () => {
  const { products, productsLoading, addProduct, updateProduct, deleteProduct, fetchProducts, toast } = useApp();

  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [sortKey,   setSortKey]   = useState("");
  const [modal,     setModal]     = useState(null);
  const [confirm,   setConfirm]   = useState(null);
  const [view,      setView]      = useState("grid");

  // Apply sort + category filter server-side; search is client-side for snappiness
  const applyFilters = (newSearch, newCat, newSort) => {
    const [sort_by, sort_dir] = newSort ? newSort.split("_") : ["", ""];
    fetchProducts({
      search:   newSearch,
      category: newCat,
      sort_by,
      sort_dir,
    });
  };

  const handleSearch = (val) => { setSearch(val); applyFilters(val, catFilter, sortKey); };
  const handleCat    = (cat) => { setCatFilter(cat); applyFilters(search, cat, sortKey); };
  const handleSort   = (s)   => { setSortKey(s);  applyFilters(search, catFilter, s); };

  const handleAdd  = async (form) => {
    try { await addProduct(form); setModal(null); toast("Product added!"); }
    catch (e) { toast(e.message, "error"); }
  };
  const handleEdit = async (form) => {
    try { await updateProduct(modal.product.id, form); setModal(null); toast("Product updated!"); }
    catch (e) { toast(e.message, "error"); }
  };
  const handleDel  = async () => {
    try { await deleteProduct(confirm); setConfirm(null); toast("Product deleted.", "error"); }
    catch (e) { toast(e.message, "error"); }
  };

  return (
    <div style={{ animation:"fadeSlide 0.35s ease both" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <div>
          <div style={{ fontFamily:fonts.display, fontSize:"1.6rem", letterSpacing:"0.06em", color:"#fff" }}>Products</div>
          <div style={{ fontSize:"0.83rem", color:colors.muted }}>{products.length} items in inventory</div>
        </div>
        <button onClick={()=>setModal("add")} className="btn-red" style={{ background:colors.red, color:"#fff", border:"none", borderRadius:"3px", padding:"9px 20px", fontFamily:fonts.display, fontSize:"0.95rem", letterSpacing:"0.1em", cursor:"pointer" }}>
          + Add Product
        </button>
      </div>

      {/* Filters row */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px", flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e=>handleSearch(e.target.value)} placeholder="Search products…"
          style={{ background:colors.surface2, border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"8px 14px", fontFamily:fonts.body, fontSize:"0.87rem", color:"#fff", outline:"none", width:"200px" }} />

        {/* Category pills */}
        <div style={{ display:"flex", gap:"6px" }}>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>handleCat(c)}
              style={{ background:catFilter===c?colors.red:colors.surface2, border:`1px solid ${catFilter===c?colors.red:colors.border}`, color:catFilter===c?"#fff":colors.muted, borderRadius:"3px", padding:"7px 14px", fontFamily:fonts.body, fontSize:"0.82rem", cursor:"pointer", fontWeight:600 }}>
              {c}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select value={sortKey} onChange={e=>handleSort(e.target.value)}
          style={{ background:colors.surface2, border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"7px 12px", fontFamily:fonts.body, fontSize:"0.82rem", color:colors.muted, cursor:"pointer", outline:"none" }}>
          {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* View toggle */}
        <div style={{ marginLeft:"auto", display:"flex", gap:"6px" }}>
          {["grid","table"].map(v=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ background:view===v?colors.surface2:"transparent", border:`1px solid ${view===v?colors.red:colors.border}`, color:view===v?"#fff":colors.muted, borderRadius:"3px", padding:"7px 12px", cursor:"pointer", fontSize:"0.95rem" }}>
              {v==="grid"?"⊞":"☰"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {productsLoading && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:colors.muted }}>
          <div style={{ fontSize:"1.5rem", marginBottom:"12px" }}>⏳</div>
          <div>Loading products…</div>
        </div>
      )}

      {/* Empty state */}
      {!productsLoading && products.length===0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:colors.muted }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>📦</div>
          <div>No products found</div>
        </div>
      )}

      {/* Grid */}
      {!productsLoading && view==="grid" && products.length>0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"14px" }}>
          {products.map((p,i)=>(
            <div key={p.id} className="stat-card"
              style={{ background:colors.surface, border:`1px solid ${p.stock<4?"rgba(229,9,20,0.4)":colors.border}`, borderRadius:"6px", padding:"18px", animation:`cardIn 0.4s ${i*0.05}s both`, position:"relative" }}>
              <div style={{ position:"absolute", top:"10px", right:"10px", display:"flex", gap:"4px" }}>
                <button onClick={()=>setModal({type:"edit",product:p})} style={{ background:"rgba(52,152,219,0.15)", border:"1px solid rgba(52,152,219,0.3)", color:"#3498db", borderRadius:"3px", padding:"3px 8px", cursor:"pointer", fontSize:"0.72rem", fontFamily:fonts.body }}>Edit</button>
                <button onClick={()=>setConfirm(p.id)} style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", color:colors.red, borderRadius:"3px", padding:"3px 8px", cursor:"pointer", fontSize:"0.72rem", fontFamily:fonts.body }}>Del</button>
              </div>
              <div style={{ fontSize:"1.9rem", marginBottom:"10px" }}>{p.img}</div>
              <div style={{ fontSize:"0.66rem", textTransform:"uppercase", letterSpacing:"0.1em", color:colors.muted, marginBottom:"4px" }}>{p.category}</div>
              <div style={{ fontWeight:700, color:"#fff", marginBottom:"10px", fontSize:"0.93rem", paddingRight:"52px" }}>{p.name}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                <span style={{ fontSize:"0.88rem", color:"#fff", fontWeight:600 }}>₱{p.price}</span>
                <Badge color={stockColor(p.stock)}>×{p.stock}</Badge>
              </div>
              <div style={{ fontSize:"0.75rem", color: String(p.trend).startsWith("+") ? "#2ecc71" : colors.red }}>{p.trend} this week</div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {!productsLoading && view==="table" && products.length>0 && (
        <div style={{ background:colors.surface, border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"rgba(0,0,0,0.3)" }}>
              {["","ID","Name","Category","Stock","Price","Status","Actions"].map(h=>(
                <th key={h} style={{ textAlign:"left", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:colors.muted, padding:"10px 14px", borderBottom:`1px solid ${colors.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id} className="order-row">
                  <td style={{ padding:"10px 14px", fontSize:"1.3rem", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{p.img}</td>
                  <td style={{ padding:"10px 14px", color:colors.red, fontWeight:700, fontSize:"0.8rem", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>#{p.id}</td>
                  <td style={{ padding:"10px 14px", fontWeight:700, color:"#fff", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{p.name}</td>
                  <td style={{ padding:"10px 14px", color:colors.muted, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>{p.category}</td>
                  <td style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}><Badge color={stockColor(p.stock)}>{p.stock} units</Badge></td>
                  <td style={{ padding:"10px 14px", color:"#fff", fontWeight:600, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>${p.price}</td>
                  <td style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}><Badge color={stockColor(p.stock)}>{stockLabel(p.stock)}</Badge></td>
                  <td style={{ padding:"10px 14px", color:"#fff", fontWeight:600, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>₱{p.price}
                    <div style={{ display:"flex", gap:"6px" }}>
                      <button onClick={()=>setModal({type:"edit",product:p})} style={{ background:"rgba(52,152,219,0.15)", border:"1px solid rgba(52,152,219,0.3)", color:"#3498db", borderRadius:"3px", padding:"4px 10px", cursor:"pointer", fontSize:"0.78rem", fontFamily:fonts.body }}>Edit</button>
                      <button onClick={()=>setConfirm(p.id)} style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", color:colors.red, borderRadius:"3px", padding:"4px 10px", cursor:"pointer", fontSize:"0.78rem", fontFamily:fonts.body }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal==="add"        && <Modal title="Add New Product" onClose={()=>setModal(null)}><ProductForm onSave={handleAdd} onCancel={()=>setModal(null)}/></Modal>}
      {modal?.type==="edit" && <Modal title="Edit Product" onClose={()=>setModal(null)}><ProductForm initial={modal.product} onSave={handleEdit} onCancel={()=>setModal(null)}/></Modal>}
      {confirm              && <ConfirmDialog message={`Delete "${products.find(p=>p.id===confirm)?.name}"? This cannot be undone.`} onConfirm={handleDel} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
};

export default ProductsPage;
