// // src/components/CandidateCard.jsx
// import React from "react";
// import "./candidate-card.css"; // small per-component CSS file

// export default function CandidateCard({ candidate, voted, onVote, disabled }) {
//   // voted: boolean — whether this candidate was voted by current user (for blink/red)
//   return (
//     <div
//       className={`ccard ${voted ? "voted" : ""} ${disabled ? "disabled" : ""}`}
//       onClick={() => !disabled && onVote(candidate)}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !disabled && onVote(candidate)}
//     >
//       <div className="ccard-top">
//         <img className="ccard-avatar" src={candidate.imageUrl || "/logo.png"} alt={candidate.name} />
//       </div>

//       <div className="ccard-body">
//         <h3 className="ccard-name">{candidate.name}</h3>
//         <p className="ccard-bio">{candidate.bio || "No bio provided."}</p>
//       </div>

//       <div className="ccard-footer">
//         <button
//           className={`ccard-btn ${voted ? "btn-voted" : ""}`}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!disabled) onVote(candidate);
//           }}
//           disabled={disabled}
//         >
//           {voted ? "Voted" : "Vote"}
//         </button>
//       </div>
//     </div>
//   );
// }
