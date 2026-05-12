import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/api/registrations", async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "mail.particleswithoutborders.com",
    port: Number(process.env.EMAIL_PORT) || 26,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER || "admin@particleswithoutborders.com", 
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const id = "REG-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const { name, email, category } = req.body;
    console.log("New registration:", req.body);

    const info = await transporter.sendMail({
      from: '"Particles Without Borders" <admin@particleswithoutborders.com>',
      to: email,
      bcc: "scientific@particleswithoutborders.com, secretariat@particleswithoutborders.com",
      replyTo: "secretariat@particleswithoutborders.com",
      subject: "Registration Confirmed — Particles Without Borders 2026",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #0e7490;">Registration Confirmed!</h1>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for registering for <strong>Particles Without Borders 2026</strong>.</p>
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Reference ID:</strong> ${id}</p>
            <p style="margin: 0 0 8px 0;"><strong>Category:</strong> ${category}</p>
          </div>
          <p>Our team will review your submission and send payment instructions within 3 working days.</p>
          <p>Questions? Email us at <a href="mailto:secretariat@particleswithoutborders.com">secretariat@particleswithoutborders.com</a></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">Particles Without Borders · KLCC, Kuala Lumpur · 16 November 2026</p>
        </div>
      `
    });

    console.log("Message sent to %s: %s", email, info.messageId);
    res.json({ ok: true, registration: { id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

export default app;
