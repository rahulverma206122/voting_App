// models/Vote.js
const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, for audit
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vote", VoteSchema);
