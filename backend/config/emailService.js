/**
 * GoodMatter Email Service (Resend)
 * Sends notifications for investor interest, deal approvals, etc.
 * Uses Resend API for improved deliverability and security.
 */

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@goodmatter.in';
const FROM_EMAIL  = process.env.FROM_EMAIL  || 'GoodMatter Platform <onboarding@resend.dev>'; // Template address from Resend

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Notify admin when an investor marks interest in a deal.
 */
async function notifyAdminInvestorInterest({ investorName, investorEmail, startupName, aiScore }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIPPED - no Resend API Key] Investor interest: ${investorName} → ${startupName}`);
    return;
  }
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🔔 Investor Interest: ${investorName} → ${startupName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color:#6366f1;">GoodMatter — Investor Interest Notification</h2>
          <p>An investor has expressed interest in a deal. Please facilitate the introduction.</p>
          <table style="width:100%;border-collapse:collapse;margin:1.5rem 0;">
            <tr style="background:#f8f9fa;">
              <td style="padding:10px;font-weight:bold;">Investor</td>
              <td style="padding:10px;">${investorName}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;">Investor Email</td>
              <td style="padding:10px;">${investorEmail}</td>
            </tr>
            <tr style="background:#f8f9fa;">
              <td style="padding:10px;font-weight:bold;">Startup</td>
              <td style="padding:10px;">${startupName}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;">AI Score</td>
              <td style="padding:10px;">${aiScore || 'N/A'}/100</td>
            </tr>
          </table>
          <p style="color:#6366f1;font-weight:bold;">Action Required: Manually introduce the investor and founder.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;"/>
          <p style="color:#888;font-size:0.85rem;text-align:center;">GoodMatter Platform — Admin Notification System</p>
        </div>
      `,
    });
    console.log('Admin investor interest notification sent:', data.id);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

/**
 * Notify admin when a new startup deal is submitted.
 */
async function notifyAdminNewDeal({ founderName, startupName, industry, stage, aiScore }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIPPED] New deal: ${startupName} by ${founderName}`);
    return;
  }
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `📬 New Deal Submission: ${startupName} (Score: ${aiScore}/100)`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color:#6366f1;">New Deal Submission</h2>
          <table style="width:100%;border-collapse:collapse;margin:1.5rem 0;">
            <tr style="background:#f8f9fa;"><td style="padding:10px;font-weight:bold;">Startup</td><td style="padding:10px;">${startupName}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;">Founder</td><td style="padding:10px;">${founderName}</td></tr>
            <tr style="background:#f8f9fa;"><td style="padding:10px;font-weight:bold;">Industry</td><td style="padding:10px;">${industry}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;">Stage</td><td style="padding:10px;">${stage}</td></tr>
            <tr style="background:#f8f9fa;"><td style="padding:10px;font-weight:bold;">AI Score</td><td style="padding:10px;font-weight:bold;color:#6366f1;">${aiScore}/100</td></tr>
          </table>
          <p>Please review this submission in the admin panel.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;"/>
          <p style="color:#888;font-size:0.85rem;text-align:center;">GoodMatter Platform — Admin Notification System</p>
        </div>
      `,
    });
    console.log('Admin new deal notification sent:', data.id);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

/**
 * Send a 6-digit OTP to a founder for passwordless login.
 * Uses Nodemailer & Gmail to bypass Resend domain limitations.
 */
async function sendOtpEmail(email, otp) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log(`[EMAIL SKIPPED] No EMAIL_USER/PASS found. Sending OTP ${otp} to ${email} failed.`);
    return;
  }
  
  try {
    const info = await transporter.sendMail({
      from: `"GoodMatter Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your GoodMatter Login Code: ${otp}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border: 1px solid #e2e8f0; border-radius: 8px; padding: 30px; text-align: center;">
          <h2 style="color:#6366f1; margin-bottom: 20px;">GoodMatter Login Code</h2>
          <p style="font-size: 16px; color: #4b5563; margin-bottom: 30px;">
            Please use the following code to complete your login securely. This code will expire in 10 minutes.
          </p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otp}</span>
          </div>
          <p style="color:#888;font-size:0.85rem;text-align:center;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log('OTP email sent via Nodemailer:', info.messageId);
  } catch (err) {
    console.error('Nodemailer send OTP error:', err.message);
  }
}

module.exports = { notifyAdminInvestorInterest, notifyAdminNewDeal, sendOtpEmail };
