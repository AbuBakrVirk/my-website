const express = require("express");
const { body, validationResult } = require("express-validator");
const { sendSubscriptionEmail } = require("../utils/email");

const router = express.Router();

// In-memory store (replace with DB collection later)
const subscribers = new Set();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ═══════════════════════════════════════
   POST /api/subscribe
═══════════════════════════════════════ */
router.post(
  "/",
  [body("email").isEmail().normalizeEmail().withMessage("Valid email is required")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { email } = req.body;

    if (subscribers.has(email)) {
      return res.json({ success: true, message: "You're already subscribed!" });
    }

    subscribers.add(email);

    // Send confirmation email to subscriber
    await sendSubscriptionEmail({ to: email }).catch((err) =>
      console.error("Subscription email failed:", err.message)
    );

    res.json({
      success: true,
      message: "Subscribed successfully! Check your inbox for a confirmation.",
    });
  })
);

module.exports = router;
