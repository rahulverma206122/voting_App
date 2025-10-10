// db.js
// Centralized MongoDB connection (works with both Atlas and local MongoDB)

const mongoose = require("mongoose");
require("dotenv").config();

// ✅ Preferred order: Atlas URL → Local Mongo URL
const mongoURL =
  process.env.MONGODB_URL ||           // from .env (Atlas)
  process.env.MONGODB_URL_LOCAL ||     // local dev fallback
  process.env.MONGO_URI ||             // alternate env variable names
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/voting_app"; // hardcoded local fallback

// ✅ Connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// ✅ Try connecting
mongoose
  .connect(mongoURL, mongooseOptions)
  .then(() => console.log("✅ MongoDB connected:", mongoURL))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // process.exit(1); // Uncomment if you want the app to stop on failure
  });

// ✅ Connection event listeners
const db = mongoose.connection;

db.on("connected", () => console.log("MongoDB event: connected"));
db.on("error", (err) => console.error("MongoDB event: error", err));
db.on("disconnected", () => console.log("MongoDB event: disconnected"));

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = db;
