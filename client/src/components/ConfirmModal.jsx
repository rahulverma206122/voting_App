// // src/components/ConfirmModal.jsx
// import React from "react";

// export default function ConfirmModal({ open, candidate, onConfirm, onClose }) {
//   if (!open) return null;
//   return (
//     <div style={overlay}>
//       <div style={modal}>
//         <h3>Confirm your vote</h3>
//         <p>
//           Are you sure you want to vote for <strong>{candidate?.name}</strong>?
//         </p>
//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
//           <button onClick={onClose} style={secondaryBtn}>
//             Cancel
//           </button>
//           <button onClick={onConfirm} style={primaryBtn}>
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const overlay = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.4)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 999,
// };

// const modal = {
//   width: 360,
//   background: "#fff",
//   padding: 20,
//   borderRadius: 8,
//   boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
// };

// const primaryBtn = {
//   background: "#007bff",
//   color: "#fff",
//   border: "none",
//   padding: "8px 12px",
//   borderRadius: 6,
//   cursor: "pointer",
// };

// const secondaryBtn = {
//   background: "#eee",
//   border: "none",
//   padding: "8px 12px",
//   borderRadius: 6,
//   cursor: "pointer",
// };
