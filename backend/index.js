require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
const path    = require("path");

const { connectDB }           = require("./db/connection");
const authRoutes              = require("./routes/auth");
const orderRoutes             = require("./routes/orders");
const subscribeRoutes         = require("./routes/subscribe");
const contactRoutes           = require("./routes/contact");
const { verifyEmailConnection } = require("./utils/email");

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Security & logging ── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ── CORS ── */
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://motorly.up.railway.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // Allow any localhost port in development
      if (process.env.NODE_ENV === "development" && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.some((o) => origin.startsWith(o))) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ── Body parsing ── */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

/* ── API Routes ── */
app.use("/api/auth",      authRoutes);
app.use("/api/orders",    orderRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/contact",   contactRoutes);

/* ── Health check ── */
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Motorly API is running 🚗", timestamp: new Date().toISOString() })
);

/* ── Serve React frontend in production ── */
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/* ── 404 handler (dev only — production uses React catch-all) ── */
if (process.env.NODE_ENV !== "production") {
  app.use((req, res) =>
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` })
  );
}

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error("\n🔴 Unhandled error on", req.method, req.path);
  console.error(err.stack || err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "development"
      ? err.message
      : "Internal server error. Please try again.",
  });
});

const server = app.listen(PORT, async () => {
  console.log(`\n🚗  Motorly API running on port ${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/api/health\n`);
  await connectDB();
  verifyEmailConnection();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌  Port ${PORT} is already in use.`);
    console.error(`   Run this to free it:  npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
