require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

app.get("/api/data", authenticateToken, (req, res) => {
  res.json({
    message:
      "Hello Dr. Russell! This data was fetched securely from the backend.",
    timestamp: new Date().toLocaleString(),
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Backend running on port ${process.env.PORT}`),
);
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("DB Connection Error:", err);
  else console.log("Database Connected!");
});
