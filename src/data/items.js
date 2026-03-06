// ─── Inventory Data ───────────────────────────────────────────────────────────
// Original data from items.js (recovered from git), extended with
// price, image emoji, and weekly trend for the dashboard.

export const electronics = [
  { id: 1, name: "Laptop Pro 15",  category: "Electronics", stock: 12, price: 1299, img: "💻", trend: "+8%"  },
  { id: 2, name: "4K Monitor",     category: "Electronics", stock: 8,  price: 449,  img: "🖥️", trend: "+12%" },
  { id: 3, name: "Mech Keyboard",  category: "Electronics", stock: 25, price: 149,  img: "⌨️", trend: "+3%"  },
  { id: 8, name: "Webcam HD",      category: "Electronics", stock: 2,  price: 129,  img: "📷", trend: "+22%" },
];

export const furniture = [
  { id: 5, name: "Office Chair",  category: "Furniture", stock: 5,  price: 349, img: "🪑", trend: "-2%"  },
  { id: 6, name: "Standing Desk", category: "Furniture", stock: 3,  price: 699, img: "🪵", trend: "+18%" },
];

export const peripherals = [
  { id: 4, name: "Wireless Mouse", category: "Peripherals", stock: 31, price: 59,  img: "🖱️", trend: "+5%" },
  { id: 7, name: "USB-C Hub",      category: "Peripherals", stock: 44, price: 49,  img: "🔌", trend: "+6%" },
];

export const allProducts = [...electronics, ...furniture, ...peripherals];
