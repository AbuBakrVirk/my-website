const express = require("express");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

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

    // Send notification to admin
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });

      // Email to admin (fire and forget)
      transporter.sendMail({
        from: `"Motorly Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `[Contact Form] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#fea928;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:100px;">Name:</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email:</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Subject:</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${subject}</td></tr>
            </table>
            <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-top:16px;">
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="margin-top:16px;font-size:12px;color:#9ca3af;">Reply directly to this email to respond to ${name}.</p>
          </div>
        `,
        replyTo: email,
      }).catch((err) => console.error("Contact admin email failed:", err.message));

      // Auto-reply to sender (fire and forget)
      transporter.sendMail({
        from: `"Motorly Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "We received your message — Motorly",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f3f4f6;padding:40px 16px;">
            <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <div style="background:linear-gradient(135deg,#fea928,#ed8900);padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">🚗 Motorly</h1>
              </div>
              <div style="padding:32px 40px;">
                <h2 style="margin:0 0 12px;color:#111827;font-size:20px;">Hi ${name}! 👋</h2>
                <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
                  Thanks for reaching out. We've received your message and will get back to you within <strong>24 hours</strong>.
                </p>
                <div style="background:#f9fafb;border-radius:8px;padding:16px;border-left:4px solid #fea928;">
                  <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;">Your message:</p>
                  <p style="margin:8px 0 0;font-size:14px;color:#374151;">${message.replace(/\n/g, "<br>")}</p>
                </div>
              </div>
              <div style="background:#f9fafb;padding:16px 40px;text-align:center;border-top:1px solid #f3f4f6;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Motorly. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
      }).catch((err) => console.error("Contact auto-reply failed:", err.message));
    }

    res.json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
    });
  })
);

module.exports = router;
