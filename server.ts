import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("agency.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    videoUrl TEXT,
    clientUrl TEXT
  );
  CREATE TABLE IF NOT EXISTS scoop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    thumbnailUrl TEXT,
    link TEXT
  );
`);

// Seed data if empty
const partnerCount = db.prepare("SELECT COUNT(*) as count FROM partners").get() as { count: number };
console.log("Current partner count:", partnerCount.count);
if (partnerCount.count === 0) {
  console.log("Seeding partners...");
  const insertPartner = db.prepare("INSERT INTO partners (name, videoUrl, clientUrl) VALUES (?, ?, ?)");
  insertPartner.run("alpro", "/0227%20(1).mp4", "#");
  insertPartner.run("action", "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4", "#");
  insertPartner.run("gall & gall", "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4", "#");
  insertPartner.run("hornbach", "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4", "#");
  insertPartner.run("jägermeister", "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4", "#");
  insertPartner.run("biscoff", "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4", "#");
  console.log("Seeding complete.");
}

const scoopCount = db.prepare("SELECT COUNT(*) as count FROM scoop").get() as { count: number };
if (scoopCount.count === 0) {
  const insertScoop = db.prepare("INSERT INTO scoop (title, date, thumbnailUrl, link) VALUES (?, ?, ?, ?)");
  insertScoop.run("The Future of Social", "Feb 22, 2026", "https://picsum.photos/seed/social/400/600", "#");
  insertScoop.run("AI in Content Creation", "Feb 20, 2026", "https://picsum.photos/seed/ai/400/600", "#");
  insertScoop.run("Viral Marketing Secrets", "Feb 18, 2026", "https://picsum.photos/seed/viral/400/600", "#");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/partners", (req, res) => {
    console.log("Fetching partners...");
    const partners = db.prepare("SELECT * FROM partners").all();
    console.log("Partners found:", partners.length);
    res.json(partners);
  });

  app.get("/api/scoop", (req, res) => {
    const scoop = db.prepare("SELECT * FROM scoop").all();
    res.json(scoop);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
