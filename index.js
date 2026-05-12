import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  if (!process.env.EMAIL_PASS) {
    console.warn("WARNING: EMAIL_PASS environment variable is missing. Emails may fail to send or be rejected as spam.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "mail.particleswithoutborders.com",
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === "true" || true,
    auth: {
      user: process.env.EMAIL_USER || "admin@particleswithoutborders.com", 
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log("SMTP Connection Error:", error);
    } else {
      console.log("SMTP server is ready to take our messages");
    }
  });

  app.use(cors({
    origin: [
      "https://particles-without-borders-5nhz-two.vercel.app",
      "https://particles-without-borders-wivr-8dui1k35z.vercel.app",
      "http://localhost:5000",
      "http://localhost:3000"
    ]
  }));

  app.use(express.json());

  async function sendConfirmationEmail(to, name, registrationId, category) {
    const info = await transporter.sendMail({
      from: '"Particles Without Borders" <admin@particleswithoutborders.com>',
      to: to,
      bcc: "scientific@particleswithoutborders.com, secretariat@particleswithoutborders.com",
      replyTo: "secretariat@particleswithoutborders.com",
      subject: "Registration Confirmed — Particles Without Borders 2026",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #0e7490;">Registration Confirmed!</h1>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for registering for <strong>Particles Without Borders 2026</strong>.</p>
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Reference ID:</strong> ${registrationId}</p>
            <p style="margin: 0 0 8px 0;"><strong>Category:</strong> ${category}</p>
          </div>
          <p>Our team will review your submission and send payment instructions within 3 working days.</p>
          <p>Questions? Email us at <a href="mailto:secretariat@particleswithoutborders.com">secretariat@particleswithoutborders.com</a></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">Particles Without Borders · KLCC, Kuala Lumpur · 16 November 2026</p>
        </div>
      `
    });
    console.log("Message sent to %s: %s", to, info.messageId);
  }

  app.post("/api/registrations", async (req, res) => {
    try {
      const id = "REG-" + Math.random().toString(36).slice(2, 10).toUpperCase();
      const { name, email, category } = req.body;
      console.log("New registration:", req.body);

      try {
        await sendConfirmationEmail(email, name, id, category);
      } catch (emailErr) {
        console.error("Email error (non-fatal):", emailErr.message);
      }

      res.json({ ok: true, registration: { id } });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  
  function startListening() {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, retrying in 1 second...`);
        setTimeout(() => {
          server.close();
          startListening();
        }, 1000);
      } else {
        console.error('Server error:', err);
      }
    });
  }

  startListening();
}

startServer();