const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware } = require("../jwt");

// ✅ Helper — Check if user is admin
async function checkAdminRole(userId) {
  try {
    const user = await User.findById(userId);
    return user && user.role === "admin";
  } catch (err) {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*                          🧾 ADMIN: ADD CANDIDATE                           */
/* -------------------------------------------------------------------------- */
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ success: false, message: "User does not have admin role" });
    }

    const { name, party, age, imageUrl } = req.body;
    if (!name || !party || !age) {
      return res.status(400).json({ success: false, message: "Missing required candidate fields" });
    }

    const newCandidate = new Candidate({ name, party, age, imageUrl });
    const saved = await newCandidate.save();

    res.status(201).json({
      success: true,
      message: "Candidate added successfully",
      candidate: saved,
    });
  } catch (err) {
    console.error("Error adding candidate:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                          ✏️ ADMIN: UPDATE CANDIDATE                         */
/* -------------------------------------------------------------------------- */
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ success: false, message: "User does not have admin role" });
    }

    const { candidateID } = req.params;
    const updateData = req.body;

    const updated = await Candidate.findByIdAndUpdate(candidateID, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ success: false, message: "Candidate not found" });

    res.status(200).json({ success: true, message: "Candidate updated successfully", candidate: updated });
  } catch (err) {
    console.error("Error updating candidate:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                          🗑️ ADMIN: DELETE CANDIDATE                        */
/* -------------------------------------------------------------------------- */
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ success: false, message: "User does not have admin role" });
    }

    const { candidateID } = req.params;
    const deleted = await Candidate.findByIdAndDelete(candidateID);

    if (!deleted) return res.status(404).json({ success: false, message: "Candidate not found" });

    res.status(200).json({ success: true, message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                          🗳️ USER: CAST VOTE                                */
/* -------------------------------------------------------------------------- */
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    const { candidateID } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Admin cannot vote" });
    if (user.isVoted) return res.status(400).json({ success: false, message: "You have already voted" });

    const candidate = await Candidate.findById(candidateID);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    // Record vote
    candidate.votes.push({ user: userId });
    candidate.voteCount += 1;
    await candidate.save();

    // Mark user as voted
    user.isVoted = true;
    await user.save();

    res.status(200).json({ success: true, message: "Vote recorded successfully" });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                          📊 ADMIN: GET VOTE COUNTS                          */
/* -------------------------------------------------------------------------- */
router.get("/results", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ success: false, message: "User does not have admin role" });
    }

    const results = await Candidate.find().sort({ voteCount: -1 });
    res.status(200).json({
      success: true,
      results: results.map((c) => ({
        name: c.name,
        party: c.party,
        votes: c.voteCount,
      })),
    });
  } catch (err) {
    console.error("Results error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                          👥 PUBLIC: LIST CANDIDATES                         */
/* -------------------------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find({}, "name party age imageUrl voteCount");
    res.status(200).json({ success: true, candidates });
  } catch (err) {
    console.error("List candidates error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
