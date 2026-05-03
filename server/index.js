require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

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
  "http://localhost:4173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
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

/* ── Routes ── */
app.use("/api/auth",      authRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/contact",  contactRoutes);

/* ── Health check ── */
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Motorly API is running 🚗", timestamp: new Date().toISOString() })
);

/* ── Test email endpoint (dev only) ── */
app.post("/api/test-email", async (req, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ success: false, message: "Only available in development." });
  }
  const { sendWelcomeEmail } = require("./utils/email");
  const { to = "test@example.com" } = req.body;
  const result = await sendWelcomeEmail({ to, name: "Test User" });
  res.json({ success: true, result });
});

/* ── 404 handler ── */
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` })
);

/* ── Global error handler — logs full stack in dev ── */
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

app.listen(PORT, async () => {
  console.log(`\n🚗  Motorly API running on http://localhost:${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/api/health\n`);
  await connectDB();        // connect MongoDB (or warn if not configured)
  verifyEmailConnection();  // check Resend API key
});
