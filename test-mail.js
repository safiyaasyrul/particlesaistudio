import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "mail.particleswithoutborders.com",
  port: 26, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.sendMail({
  from: '"Particles Without Borders" <admin@particleswithoutborders.com>',
  to: "test@example.com",
  subject: "Testing Nodemailer",
  html: "<p>Test mail</p>"
})
.then(info => console.log("Sent:", info.messageId))
.catch(err => console.error("Mail error:", err));
