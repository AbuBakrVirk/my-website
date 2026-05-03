const express = require("express");
const { body, validationResult } = require("express-validator");
const { Resend } = require("resend");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const FROM   = process.env.RESEND_FROM  || "Motorly <onboarding@resend.dev>";
const ADMIN  = process.env.ADMIN_EMAIL  || process.env.GMAIL_USER;

/* ═══════════════════════════════════════
   POST /api/contact
═══════════════════════════════════════ */
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Respond immediately — emails send in background
    res.json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
    });

    // Fire-and-forget emails after response is sent
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      if (ADMIN) {
        resend.emails.send({
          from: FROM,
          to: [ADMIN],
          replyTo: email,
          subject: `[Contact] ${subject}`,
          html: `<div style="font-family:sans-serif;padding:24px;max-width:600px;">
            <h2 style="color:#fea928;">New Contact Message</h2>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:12px;">
              <p style="margin:0;white-space:pre-wrap;">${message}</p>
            </div>
          </div>`,
        }).catch((e) => console.error("Contact admin email failed:", e.message));
      }

      resend.emails.send({
        from: FROM,
        to: [email],
        subject: "We received your message — Motorly 🚗",
        html: `<div style="font-family:sans-serif;padding:24px;max-width:600px;">
          <div style="background:linear-gradient(135deg,#fea928,#ed8900);padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;">🚗 Motorly</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #f3f4f6;border-radius:0 0 12px 12px;">
            <h2 style="margin:0 0 12px;color:#111827;">Hi ${name}! 👋</h2>
            <p style="color:#6b7280;line-height:1.7;">
              Thanks for reaching out. We've received your message and will reply within <strong>24 hours</strong>.
            </p>
            <div style="background:#f9fafb;border-left:4px solid #fea928;padding:16px;border-radius:4px;margin-top:16px;">
              <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;">Your message:</p>
              <p style="margin:8px 0 0;color:#374151;white-space:pre-wrap;">${message}</p>
            </div>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
            © ${new Date().getFullYear()} Motorly. All rights reserved.
          </p>
        </div>`,
      }).catch((e) => console.error("Contact auto-reply failed:", e.message));
    } else {
      console.log(`📧 [EMAIL SKIPPED] Contact from ${email} — set RESEND_API_KEY in Railway`);
    }
  })
);

module.exports = router;
