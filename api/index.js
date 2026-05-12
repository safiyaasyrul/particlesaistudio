// api/index.js
// Vercel serverless function for /api/registrations
// Uses the same env vars as defined in .env.example

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Email transporter — matches .env.example EMAIL_* variables
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// POST /api/registrations
app.post('/api/registrations', async (req, res) => {
  try {
    const data = req.body;

    // Forward registration to Supabase
    const supabaseUrl = `https://lmzftlvxoncqdonbkcyd.supabase.co/rest/v1/registrations`;
    const supabaseRes = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });

    const result = await supabaseRes.json();

    if (!supabaseRes.ok) {
      throw new Error(result?.message || 'Supabase insert failed');
    }

    // Send confirmation email if email is provided
    if (data.email) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"Particles Without Borders" <${process.env.EMAIL_USER}>`,
          to: data.email,
          subject: 'Registration Received – Particles Without Borders',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2>Thank you for registering!</h2>
              <p>We have received your registration for <strong>Particles Without Borders</strong> and will review it shortly.</p>
              <p>We will be in touch with further details soon.</p>
              <br/>
              <p>Warm regards,<br/>Particles Without Borders Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        // Don't fail the whole request if email fails
        console.error('Email send error:', emailErr);
      }
    }

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to submit registration', details: error.message });
  }
});

// GET /api/registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const supabaseUrl = `https://lmzftlvxoncqdonbkcyd.supabase.co/rest/v1/registrations?select=*&order=created_at.desc`;
    const supabaseRes = await fetch(supabaseUrl, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
      },
    });

    const data = await supabaseRes.json();
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

export default app;
