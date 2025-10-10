// jwt.js
// Handles authentication using JWT (JSON Web Tokens)

const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_dev_key";

// 🔐 Middleware to protect routes
const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// 🧾 Function to generate JWT token
const generateToken = (userData) => {
  // Example userData: { id: user._id, role: user.role }
  const token = jwt.sign(userData, JWT_SECRET, {
    expiresIn: "7d", // ✅ 7 days is good for normal users; change as needed
  });
  return token;
};

module.exports = { jwtAuthMiddleware, generateToken };
