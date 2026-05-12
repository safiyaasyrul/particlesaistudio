import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "https://particles-without-borders-5nhz-two.vercel.app",
    "https://particles-without-borders-wivr-8dui1k35z.vercel.app",
    "http://localhost:5000"
  ]
}));

app.use(express.json());

async function sendConfirmationEmail(to, name, registrationId, category) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Particles Without Borders <onboarding@resend.dev>",
      to: [to],
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
          <p>Questions? Email us at <a href="mailto:secretariat@particleswithoutborders.org">secretariat@particleswithoutborders.org</a></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">Particles Without Borders · KLCC, Kuala Lumpur · 16 November 2026</p>
        </div>
      `
    })
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Email error:", err);
  }
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

app.get("/", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});