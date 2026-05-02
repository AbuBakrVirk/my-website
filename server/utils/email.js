const nodemailer = require("nodemailer");

/* ─────────────────────────────────────────────────────────────
   Config check
   Requires GMAIL_USER and GMAIL_APP_PASSWORD in .env
   
   How to get Gmail App Password (2 minutes):
   1. Go to https://myaccount.google.com/security
   2. Enable 2-Step Verification
   3. Go to https://myaccount.google.com/apppasswords
   4. Select "Mail" → Generate → copy the 16-char password
   5. Paste it as GMAIL_APP_PASSWORD in server/.env
───────────────────────────────────────────────────────────── */
const isConfigured = () =>
  process.env.GMAIL_USER &&
  process.env.GMAIL_APP_PASSWORD &&
  process.env.GMAIL_USER !== "your_gmail@gmail.com" &&
  process.env.GMAIL_APP_PASSWORD !== "your_app_password";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

/* ── Startup verification ── */
const verifyEmailConnection = async () => {
  if (!isConfigured()) {
    console.warn("\n⚠️  EMAIL NOT CONFIGURED — emails will be skipped.");
    console.warn("   To enable emails for ANY recipient:");
    console.warn("   1. Set GMAIL_USER=your_gmail@gmail.com in server/.env");
    console.warn("   2. Set GMAIL_APP_PASSWORD=your_16_char_app_password");
    console.warn("   3. Get App Password: https://myaccount.google.com/apppasswords");
    console.warn("   4. Restart the server\n");
    return;
  }
  try {
    await createTransporter().verify();
    console.log(`✅  Gmail SMTP ready — sending from ${process.env.GMAIL_USER}`);
  } catch (err) {
    console.error("❌  Gmail SMTP failed:", err.message);
    if (err.code === "EAUTH") {
      console.error("   → Wrong credentials. Use an App Password, not your real Gmail password.");
      console.error("   → https://myaccount.google.com/apppasswords");
    }
  }
};

/* ── Safe send — works for ANY email address ── */
const safeSend = async ({ to, subject, html }, label) => {
  if (!isConfigured()) {
    console.log(`📧  [EMAIL SKIPPED] ${label} → ${to}`);
    return;
  }
  try {
    const info = await createTransporter().sendMail({
      from:    `"Motorly" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅  Email sent [${label}] → ${to} (id: ${info.messageId})`);
  } catch (err) {
    console.error(`❌  Email FAILED [${label}] → ${to}: ${err.message}`);
  }
};

/* ── Shared HTML wrapper ── */
const wrap = (body) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0"
  style="background:#fff;border-radius:16px;overflow:hidden;
         box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
  ${body}
  <tr>
    <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">
        © ${new Date().getFullYear()} Motorly — Premium Automotive Store
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

const topBar = (emoji, sub) => `
<tr>
  <td style="background:linear-gradient(135deg,#fea928,#ed8900);padding:36px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:30px;font-weight:800;">${emoji} Motorly</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;
              letter-spacing:2px;text-transform:uppercase;">${sub}</p>
  </td>
</tr>`;

/* ════════════════════════════════════════
   1. Welcome email
════════════════════════════════════════ */
const sendWelcomeEmail = ({ to, name }) =>
  safeSend({
    to,
    subject: "Welcome to Motorly! 🚗",
    html: wrap(`
      ${topBar("🚗", "Premium Automotive Store")}
      <tr><td style="padding:40px;">
        <h2 style="margin:0 0 12px;color:#111827;font-size:22px;">Welcome aboard, ${name}! 👋</h2>
        <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.7;">
          Your Motorly account is ready. You now have access to 10,000+ premium
          car accessories, genuine parts, and performance upgrades.
        </p>
        <div style="background:#fff7ed;border-left:4px solid #fea928;border-radius:8px;padding:16px 20px;margin:24px 0;">
          <p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">🎉 New Member Offer</p>
          <p style="margin:6px 0 0;color:#78350f;font-size:13px;">
            Use code <strong>WELCOME10</strong> for 10% off your first order!
          </p>
        </div>
        <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
          <tr>
            <td style="background:linear-gradient(135deg,#fea928,#ed8900);border-radius:50px;padding:14px 32px;">
              <a href="${process.env.CLIENT_URL}/shop"
                 style="color:#fff;text-decoration:none;font-weight:700;font-size:15px;">
                Shop Now →
              </a>
            </td>
          </tr>
        </table>
      </td></tr>
    `),
  }, `Welcome / ${name}`);

/* ════════════════════════════════════════
   2. Password reset
════════════════════════════════════════ */
const sendPasswordResetEmail = ({ to, name, resetUrl }) =>
  safeSend({
    to,
    subject: "Reset Your Motorly Password",
    html: wrap(`
      ${topBar("🔐", "Password Reset")}
      <tr><td style="padding:40px;">
        <h2 style="margin:0 0 12px;color:#111827;font-size:22px;">Password Reset Request</h2>
        <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.7;">
          Hi ${name}, click the button below to reset your password.
          This link expires in <strong>1 hour</strong>.
        </p>
        <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
          <tr>
            <td style="background:linear-gradient(135deg,#fea928,#ed8900);border-radius:50px;padding:14px 32px;">
              <a href="${resetUrl}" style="color:#fff;text-decoration:none;font-weight:700;font-size:15px;">
                Reset Password →
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#9ca3af;font-size:13px;">
          If you didn't request this, ignore this email — your password won't change.
        </p>
        <div style="background:#fef2f2;border-radius:8px;padding:12px 16px;margin-top:20px;">
          <p style="margin:0;color:#991b1b;font-size:12px;">⚠️ Never share this link with anyone.</p>
        </div>
      </td></tr>
    `),
  }, `PasswordReset / ${name}`);

/* ════════════════════════════════════════
   3. Order confirmation
════════════════════════════════════════ */
const sendOrderConfirmationEmail = ({ to, name, order }) => {
  const rows = order.items.map((i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:center;">${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:right;">$${i.lineTotal.toFixed(2)}</td>
    </tr>`).join("");

  const shippingText = order.shipping === 0
    ? `<span style="color:#059669;font-weight:600;">FREE</span>`
    : `$${order.shipping.toFixed(2)}`;

  return safeSend({
    to,
    subject: `Order Confirmed #${order.id} — Motorly 🚗`,
    html: wrap(`
      ${topBar("🚗", "Order Confirmed!")}
      <tr>
        <td style="padding:28px 40px 0;text-align:center;">
          <div style="display:inline-block;background:#d1fae5;border-radius:50px;padding:10px 24px;margin-bottom:12px;">
            <span style="color:#065f46;font-weight:700;font-size:14px;">✓ Order Placed Successfully</span>
          </div>
          <h2 style="margin:0 0 4px;color:#111827;font-size:22px;">Thank you, ${name}!</h2>
          <p style="margin:0;color:#6b7280;font-size:14px;">
            Order <strong style="color:#fea928;">#${order.id}</strong>
          </p>
        </td>
      </tr>
      <tr><td style="padding:24px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:13px;width:50%;">📅 Date</td>
            <td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600;text-align:right;">
              ${new Date(order.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
            </td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:13px;">📍 Delivery</td>
            <td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600;text-align:right;">${order.address}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:13px;">💳 Payment</td>
            <td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600;text-align:right;">${order.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:13px;">🚚 Est. Delivery</td>
            <td style="padding:5px 0;color:#111827;font-size:13px;font-weight:600;text-align:right;">3–5 Business Days</td>
          </tr>
        </table>

        <h3 style="margin:0 0 10px;color:#111827;font-size:15px;font-weight:700;">Order Items</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:8px 0;text-align:left;color:#6b7280;font-size:11px;text-transform:uppercase;">Product</th>
              <th style="padding:8px 0;text-align:center;color:#6b7280;font-size:11px;text-transform:uppercase;">Qty</th>
              <th style="padding:8px 0;text-align:right;color:#6b7280;font-size:11px;text-transform:uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:14px;">Subtotal</td>
            <td style="padding:5px 0;color:#374151;font-size:14px;text-align:right;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:14px;">Shipping</td>
            <td style="padding:5px 0;font-size:14px;text-align:right;">${shippingText}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;font-size:14px;">Tax (8%)</td>
            <td style="padding:5px 0;color:#374151;font-size:14px;text-align:right;">$${order.tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;color:#111827;font-size:16px;font-weight:800;border-top:2px solid #f3f4f6;">Total Paid</td>
            <td style="padding:12px 0 0;color:#fea928;font-size:18px;font-weight:800;text-align:right;border-top:2px solid #f3f4f6;">
              $${order.total.toFixed(2)}
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
          <tr>
            <td style="background:linear-gradient(135deg,#fea928,#ed8900);border-radius:50px;padding:14px 32px;">
              <a href="${process.env.CLIENT_URL}/orders"
                 style="color:#fff;text-decoration:none;font-weight:700;font-size:14px;">
                View My Orders →
              </a>
            </td>
          </tr>
        </table>
      </td></tr>
    `),
  }, `OrderConfirm #${order.id} / ${name}`);
};

module.exports = {
  verifyEmailConnection,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
