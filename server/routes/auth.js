const express  = require("express");
const bcrypt   = require("bcryptjs");
const crypto   = require("crypto");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const db      = require("../db/db");
const { signToken } = require("../utils/jwt");
const { protect }   = require("../middleware/auth");
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("../utils/email");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many attempts. Please wait 15 minutes and try again.",
    }),
});

const validate = (rules) => [...rules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}];

/* ═══════════════════════════════════════
   POST /api/auth/register
═══════════════════════════════════════ */
router.post(
  "/register",
  authLimiter,
  validate([
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ]),
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    // ✅ await — db functions are async
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ await
    const user = await db.createUser({
      id:        crypto.randomUUID(),
      firstName,
      lastName,
      name:      `${firstName} ${lastName}`,
      email,
      phone:     phone || "",
      password:  hashedPassword,
      createdAt: new Date().toISOString(),
    });

    sendWelcomeEmail({ to: email, name: firstName }).catch((err) =>
      console.error("Welcome email failed:", err.message)
    );

    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  })
);

/* ═══════════════════════════════════════
   POST /api/auth/login
═══════════════════════════════════════ */
router.post(
  "/login",
  authLimiter,
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // ✅ await
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // user.password is now guaranteed to exist (fetched with select('+password'))
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = signToken({ id: user.id, email: user.email });

    res.json({
      success: true,
      message: "Signed in successfully!",
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  })
);

/* ═══════════════════════════════════════
   GET /api/auth/me  (protected)
═══════════════════════════════════════ */
router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

/* ═══════════════════════════════════════
   POST /api/auth/forgot-password
═══════════════════════════════════════ */
router.post(
  "/forgot-password",
  authLimiter,
  validate([
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  ]),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    // ✅ await
    const user = await db.findUserByEmail(email);

    if (!user) {
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // ✅ await
    await db.saveResetToken(email, token, expiresAt);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    sendPasswordResetEmail({ to: email, name: user.firstName, resetUrl }).catch((err) =>
      console.error("Reset email failed:", err.message)
    );

    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  })
);

/* ═══════════════════════════════════════
   POST /api/auth/reset-password
═══════════════════════════════════════ */
router.post(
  "/reset-password",
  validate([
    body("token").notEmpty().withMessage("Token is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ]),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // ✅ await
    const record = await db.findResetToken(token);

    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    // ✅ await
    const user = await db.findUserByEmail(record.email);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ await
    await db.updateUser(user.id, { password: hashedPassword });
    await db.deleteResetToken(token);

    res.json({ success: true, message: "Password reset successfully. You can now sign in." });
  })
);

module.exports = router;
