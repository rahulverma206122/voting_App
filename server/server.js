// server.js
// Entry point: loads env, connects DB, mounts routes, starts server.

require("dotenv").config(); // <-- load .env first

const express = require("express");
const cors = require("cors");
const app = express();

// Use JSON parsing built into Express
app.use(express.json());

// Enable CORS for local frontend during development.
// You can change REACT_APP_API_BASE_URL or set CLIENT_ORIGIN in your .env.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Import database after dotenv so env vars are available
const db = require("./db");

// Simple health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Import route files (make sure these files exist)
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Mount routes under /api for clarity
app.use("/api/user", userRoutes);
app.use("/api/candidate", candidateRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Use PORT from env or fallback to 5000 (avoids clash with CRA on 3000)
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
