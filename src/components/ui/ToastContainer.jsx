// ─── ToastContainer.jsx ───────────────────────────────────────────────────────
// Renders floating toast notifications in the bottom-right corner.
// Reads from AppContext toasts array.

import { useApp } from "../../AppContext";

const COLORS = {
  success: { bg: "rgba(39,174,96,0.95)",  border: "#27ae60" },
  error:   { bg: "rgba(229,9,20,0.95)",   border: "#E50914" },
  info:    { bg: "rgba(52,152,219,0.95)", border: "#3498db" },
};

const ToastContainer = () => {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map(t => {
        const c = COLORS[t.type] ?? COLORS.success;
        return (
          <div
            key={t.id}
            style={{
              background:   c.bg,
              border:       `1px solid ${c.border}`,
              borderRadius: "4px",
              padding:      "12px 20px",
              color:        "#fff",
              fontFamily:   "'Barlow', sans-serif",
              fontSize:     "0.88rem",
              fontWeight:   600,
              boxShadow:    "0 8px 24px rgba(0,0,0,0.5)",
              animation:    "cardIn 0.3s ease both",
              maxWidth:     "300px",
            }}
          >
            {t.message}
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
