// ─── Design Tokens ────────────────────────────────────────────────────────────
// Central source of truth for all colors, spacing, and typography used
// across the NYX Inventory app.

export const colors = {
  red:      "#E50914",
  redDark:  "#B81D24",
  redGlow:  "rgba(229, 9, 20, 0.3)",

  bg:       "#141414",
  surface:  "#1a1a1a",
  surface2: "#222222",
  faint:    "#333333",
  border:   "#2a2a2a",

  text:     "#e5e5e5",
  muted:    "#757575",
  dim:      "#444444",
};

export const fonts = {
  display: "'Bebas Neue', sans-serif",
  body:    "'Barlow', sans-serif",
};

export const badge = {
  green:  { bg: "rgba(39,174,96,0.15)",   color: "#2ecc71" },
  yellow: { bg: "rgba(241,196,15,0.15)",  color: "#f1c40f" },
  red:    { bg: "rgba(229,9,20,0.15)",    color: "#E50914" },
  blue:   { bg: "rgba(52,152,219,0.15)",  color: "#3498db" },
  gray:   { bg: "rgba(100,100,100,0.15)", color: "#aaaaaa" },
};
