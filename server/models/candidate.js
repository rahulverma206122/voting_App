const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    party: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: "https://via.placeholder.com/150" // ✅ helps frontend display even if no photo uploaded
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// ✅ Virtual field for auto-calculated total votes (optional)
candidateSchema.virtual('totalVotes').get(function () {
    return this.votes.length || this.voteCount;
});

// ✅ Helper method: add a vote safely (avoids double-voting)
candidateSchema.methods.addVote = async function (userId) {
    // Check if user has already voted for this candidate
    const alreadyVoted = this.votes.some(v => v.user.toString() === userId.toString());
    if (alreadyVoted) {
        throw new Error("User has already voted for this candidate");
    }

    this.votes.push({ user: userId });
    this.voteCount = this.votes.length;
    await this.save();
    return this;
};

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
