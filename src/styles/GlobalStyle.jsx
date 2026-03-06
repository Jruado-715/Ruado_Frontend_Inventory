// ─── GlobalStyle ──────────────────────────────────────────────────────────────
// Injects global CSS resets, animations, and shared class utilities.
// Rendered once inside <App />.

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; background: #141414; font-family: 'Barlow', sans-serif; color: #e5e5e5; }

    ::-webkit-scrollbar       { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: #E50914; border-radius: 3px; }

    input::placeholder { color: #444 !important; }

    /* ── Animations ── */
    @keyframes cardIn    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
    @keyframes pulse     { 0%,100%{ opacity:1; } 50%{ opacity:0.5; } }
    @keyframes countUp   { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }

    /* ── Sidebar ── */
    .sidebar-item { transition: all 0.18s ease; border-left: 3px solid transparent; }
    .sidebar-item:hover  { background: rgba(229,9,20,0.08) !important; border-left-color: rgba(229,9,20,0.4) !important; color: #fff !important; }
    .sidebar-item.active { background: rgba(229,9,20,0.15) !important; border-left-color: #E50914 !important; color: #fff !important; }

    /* ── Cards & Rows ── */
    .stat-card    { transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover  { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.6) !important; }
    .product-card { transition: all 0.22s ease; }
    .product-card:hover { transform: translateY(-4px) scale(1.02); }
    .order-row:hover td { background: rgba(229,9,20,0.04) !important; }

    /* ── Buttons ── */
    .btn-red { transition: all 0.18s; }
    .btn-red:hover { background: #f40612 !important; box-shadow: 0 4px 20px rgba(229,9,20,0.5) !important; transform: translateY(-1px); }
  `}</style>
);

export default GlobalStyle;
