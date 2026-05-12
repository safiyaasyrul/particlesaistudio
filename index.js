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

  app.use(cors({
    origin: [
      "https://particles-without-borders-5nhz-two.vercel.app",
      "https://particles-without-borders-wivr-8dui1k35z.vercel.app",
      "http://localhost:5000",
      "http://localhost:3000"
    ]
  }));

  app.use(express.json());

  // Import the Vercel-ready API and mount it
  const { default: apiApp } = await import('./api/index.js');
  app.use(apiApp);

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