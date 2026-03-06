// ─── ConfirmDialog.jsx ────────────────────────────────────────────────────────
// Generic yes/no confirmation modal.
// Props: message, onConfirm, onCancel

import { colors, fonts } from "../../styles/tokens";
import Modal from "./Modal";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <Modal title="Confirm Action" onClose={onCancel} width="380px">
    <p style={{ fontSize: "0.9rem", color: colors.text, marginBottom: "22px", lineHeight: 1.6 }}>
      {message}
    </p>
    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
      <button
        onClick={onCancel}
        style={{ background: "none", border: `1px solid ${colors.border}`, color: colors.muted, borderRadius: "3px", padding: "9px 20px", fontFamily: fonts.body, fontSize: "0.87rem", cursor: "pointer" }}
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="btn-red"
        style={{ background: colors.red, border: "none", color: "#fff", borderRadius: "3px", padding: "9px 20px", fontFamily: fonts.display, fontSize: "0.9rem", letterSpacing: "0.1em", cursor: "pointer", marginTop: 0 }}
      >
        Delete
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
