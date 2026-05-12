import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import nodemailer from "nodemailer";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id             TEXT PRIMARY KEY,
      category       TEXT NOT NULL,
      name           TEXT NOT NULL,
      email          TEXT NOT NULL,
      affiliation    TEXT,
      country        TEXT,
      theme          TEXT,
      sub_role       TEXT,
      paper_title    TEXT,
      keywords       TEXT,
      dietary        TEXT,
      visa           TEXT,
      reviewer       TEXT,
      payment_status TEXT DEFAULT 'Pending',
      review_status  TEXT DEFAULT 'Pending',
      status         TEXT DEFAULT 'pending',
      invoice_sent   BOOLEAN DEFAULT FALSE,
      decision_sent  BOOLEAN DEFAULT FALSE,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'Pending'`).catch(() => {});
  await pool.query(`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'`).catch(() => {});
  await pool.query(`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS invoice_sent BOOLEAN DEFAULT FALSE`).catch(() => {});
  await pool.query(`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS decision_sent BOOLEAN DEFAULT FALSE`).catch(() => {});
}

ensureSchema().catch((err) => console.error("Schema init failed:", err));

// ── Email ─────────────────────────────────────────────────────────────────────

function makeTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function acceptanceEmail(reg) {
  return {
    subject: "Paper Acceptance Notification",
    html: `
Dear ${reg.name},

We are pleased to inform you that your paper titled:
'${reg.paper_title || "Your Submission"}'
has been ACCEPTED for presentation at Particles Without Borders 2026.

Further details regarding presentation schedule and registration will follow.

Thank you for your contribution.

Secretariat
Particles Without Borders`,
  };
}

function rejectionEmail(reg) {
  return {
    subject: "Paper Submission Outcome",
    html: `
Dear ${reg.name},

Thank you for your submission to Particles Without Borders 2026.

After careful review, we regret to inform you that your paper was not selected for presentation.

We appreciate your interest and hope to see your participation in future events.

Secretariat
Particles Without Borders`,
  };
}

function customEmail({ name, subject, message }) {
  return {
    subject,
    html: `
Dear ${name},

${message}

Secretariat
Particles Without Borders`,
  };
}

function invoiceEmail(reg) {
  const fees = { Academic: { early: "USD 450", regular: "USD 550" }, Student: { early: "USD 250", regular: "USD 320" }, Industry: { early: "USD 600", regular: "USD 750" } };
  const tier = Object.keys(fees).find((k) => reg.category?.toLowerCase().includes(k.toLowerCase())) ?? "Academic";
  const fee = fees[tier];
  const invNum = `INV-${reg.id}`;
  return {
    subject: `[Particles Without Borders 2026] Invoice ${invNum} — Registration Fee`,
    html: `
<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:auto;padding:24px">
<div style="background:linear-gradient(135deg,#0e7490,#059669);padding:32px;border-radius:16px 16px 0 0;text-align:center">
  <h1 style="color:#fff;margin:0;font-size:26px">Particles Without Borders 2026</h1>
  <p style="color:#a7f3d0;margin:8px 0 0">16 November 2026 · KLCC, Kuala Lumpur</p>
</div>
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:0 0 16px 16px;padding:32px">
  <h2 style="margin-top:0">Invoice ${invNum}</h2>
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:20px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#6b7280">Delegate</td><td style="padding:6px 0;text-align:right;font-weight:600">${reg.name}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Institution</td><td style="padding:6px 0;text-align:right">${reg.affiliation || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Country</td><td style="padding:6px 0;text-align:right">${reg.country || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Registration ID</td><td style="padding:6px 0;text-align:right;font-family:monospace">${reg.id}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Category</td><td style="padding:6px 0;text-align:right">${reg.category}</td></tr>
      <tr style="border-top:2px solid #e5e7eb"><td style="padding:12px 0 6px;font-weight:700">Conference Fee</td><td style="padding:12px 0 6px;text-align:right;font-weight:700;color:#0e7490;font-size:18px">${fee.early} <span style="font-size:13px;font-weight:400;color:#6b7280">(early bird)</span></td></tr>
      <tr><td style="padding:0;color:#6b7280;font-size:13px">Early bird rate valid until 30 Sep 2026</td><td style="padding:0;text-align:right;color:#6b7280;font-size:13px">Regular: ${fee.regular}</td></tr>
    </table>
  </div>
  <p><strong>Payment instructions:</strong></p>
  <ul>
    <li>Bank transfer details will be provided upon request to <a href="mailto:registration@particleswithoutborders.com">registration@particleswithoutborders.com</a></li>
    <li>Please quote your Registration ID <strong>${reg.id}</strong> as the payment reference.</li>
    <li>Payment due within <strong>14 days</strong> of this invoice.</li>
  </ul>
  <p>For queries regarding this invoice, please contact us at <a href="mailto:registration@particleswithoutborders.com">registration@particleswithoutborders.com</a>.</p>
  <p style="color:#6b7280;font-size:13px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
    Particles Without Borders 2026 · KLCC, Kuala Lumpur · Organised by Particles Plus, Universiti Putra Malaysia &amp; Northumbria University Newcastle
  </p>
</div>
</body></html>`,
  };
}

async function sendEmail(to, { subject, html }) {
  const transport = makeTransport();
  if (!transport) return { sent: false, reason: "SMTP not configured" };
  await transport.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
  return { sent: true };
}

// ── Express app ───────────────────────────────────────────────────────────────

const app = express();
app.use(express.json({ limit: "1mb" }));

// ── Public: registration ──────────────────────────────────────────────────────

app.post("/api/registrations", async (req, res) => {
  try {
    const b = req.body ?? {};
    console.log("Incoming registration:", b);
    const id = "REG-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    await pool.query(
      `INSERT INTO registrations
        (id, category, name, email, affiliation, country, theme,
         sub_role, paper_title, keywords, dietary, visa, reviewer, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [id, b.category ?? "", b.name ?? "", b.email ?? "", b.affiliation ?? "",
       b.country ?? "", b.theme ?? "", b.subRole ?? "", b.paperTitle ?? "",
       b.keywords ?? "", b.dietary ?? "", b.visa ?? "", b.reviewer ?? "",
       b.paymentStatus ?? "Pending"]
    );
    res.status(200).json({
      success: true,
      id,
      registration: { id }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// ── Admin auth middleware ─────────────────────────────────────────────────────

function adminAuth(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD || "pwb-admin-2026";
  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== adminPassword) return res.status(401).json({ ok: false, error: "Unauthorized" });
  next();
}

// ── Admin: list registrations ─────────────────────────────────────────────────

app.get("/api/admin/registrations", adminAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM registrations ORDER BY created_at DESC`);
    res.json({ ok: true, registrations: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch registrations" });
  }
});

// ── Admin: abstract decision ──────────────────────────────────────────────────

app.post("/api/admin/registrations/:id/decision", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;
    if (!["Accepted", "Rejected"].includes(decision))
      return res.status(400).json({ ok: false, error: "Invalid decision" });

    const { rows } = await pool.query(`SELECT * FROM registrations WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ ok: false, error: "Not found" });
    const reg = rows[0];

    await pool.query(`UPDATE registrations SET review_status = $1, status = $2, decision_sent = TRUE WHERE id = $3`, [decision, decision.toLowerCase(), id]);

    const emailContent = decision === "Accepted" ? acceptanceEmail(reg) : rejectionEmail(reg);
    const emailResult = await sendEmail(reg.email, emailContent);

    res.json({ ok: true, decision, emailResult, emailContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send decision" });
  }
});

// ── Admin: send invoice ───────────────────────────────────────────────────────

app.post("/api/admin/registrations/:id/invoice", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`SELECT * FROM registrations WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ ok: false, error: "Not found" });
    const reg = rows[0];

    await pool.query(`UPDATE registrations SET invoice_sent = TRUE WHERE id = $1`, [id]);

    const emailContent = invoiceEmail(reg);
    const emailResult = await sendEmail(reg.email, emailContent);

    res.json({ ok: true, emailResult, emailContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send invoice" });
  }
});

app.post("/api/admin/registrations/:id/custom-email", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body ?? {};
    const { rows } = await pool.query(`SELECT * FROM registrations WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ ok: false, error: "Not found" });
    const reg = rows[0];
    if (!subject || !message) return res.status(400).json({ ok: false, error: "Subject and message are required" });
    const emailContent = customEmail({ name: reg.name, subject, message });
    const emailResult = await sendEmail(reg.email, emailContent);
    res.json({ ok: true, emailResult, emailContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send custom email" });
  }
});

// ── Serve built frontend ──────────────────────────────────────────────────────

const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

const port = Number(process.env.PORT) || 5000;
app.listen(port, "0.0.0.0", () => console.log(`Server on :${port}`));
