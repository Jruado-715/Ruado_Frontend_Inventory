// ─── ItemCard ─────────────────────────────────────────────────────────────────
// Netflix-style product card used in the Products grid.
// Original component from ruado_frontend (rebuilt with NYX theme).
// Props: item { id, name, category, stock, price, img, trend }

import { useState } from "react";
import { colors, fonts } from "../../styles/tokens";
import Badge from "../ui/Badge";

const stockColor = n => (n < 4 ? "red" : n < 10 ? "yellow" : "green");

const ItemCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="product-card stat-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   colors.surface,
        border:       `1px solid ${item.stock < 4 ? "rgba(229,9,20,0.4)" : hovered ? "rgba(229,9,20,0.3)" : colors.border}`,
        borderRadius: "6px",
        padding:      "18px",
        cursor:       "pointer",
        boxShadow:    "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ fontSize: "1.9rem", marginBottom: "10px" }}>{item.img}</div>

      <div style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", color: colors.muted, marginBottom: "4px" }}>
        {item.category}
      </div>

      <div style={{ fontWeight: 700, color: "#fff", marginBottom: "10px", fontSize: "0.93rem" }}>
        {item.name}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontSize: "0.88rem", color: "#fff", fontWeight: 600 }}>${item.price}</span>
        <Badge color={stockColor(item.stock)}>×{item.stock}</Badge>
      </div>

      <div style={{ fontSize: "0.75rem", color: item.trend.startsWith("+") ? "#2ecc71" : colors.red }}>
        {item.trend} this week
      </div>
    </div>
  );
};

export default ItemCard;
