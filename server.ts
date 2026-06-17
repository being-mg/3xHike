import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const db = new Database("agency.db");

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

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
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    budget TEXT,
    requirement TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const partnerCount = db.prepare("SELECT COUNT(*) as count FROM partners").get() as { count: number };
console.log("Current partner count:", partnerCount.count);
if (partnerCount.count === 0) {
  console.log("Seeding partners...");
  const insertPartner = db.prepare("INSERT INTO partners (name, videoUrl, clientUrl) VALUES (?, ?, ?)");
  insertPartner.run("grazia stone", "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779217991/interior_design_f0sty1.mov", "#");
  insertPartner.run("plan my interior", "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218600/Doors_AI_ads_hvxw6r.mp4", "#");
  insertPartner.run("vistara infra", "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218608/motion_graphics_Real_estate_y7fz8k.mp4", "#");
  insertPartner.run("zaira jewellery", "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218601/ai_story_bracelet_ad_etgcef.mp4", "#");
  insertPartner.run("cinco livings", "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218610/ugc_ad_og6llh.mp4", "#");
  insertPartner.run("allen town international school", "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218608/school_ad_czugtm.mp4", "#");
  console.log("Seeding complete.");
} else {
  // Update the first partner to be grazia stone if the database is already seeded
  db.prepare("UPDATE partners SET name = ?, videoUrl = ? WHERE id = 1").run(
    "grazia stone", 
    "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779217991/interior_design_f0sty1.mov"
  );
  // Update the second partner to be plan my interior
  db.prepare("UPDATE partners SET name = ?, videoUrl = ? WHERE id = 2").run(
    "plan my interior", 
    "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218600/Doors_AI_ads_hvxw6r.mp4"
  );
  // Update the third partner to be vistara infra
  db.prepare("UPDATE partners SET name = ?, videoUrl = ? WHERE id = 3").run(
    "vistara infra", 
    "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218608/motion_graphics_Real_estate_y7fz8k.mp4"
  );
  // Update the fourth partner to be zaira jewellery
  db.prepare("UPDATE partners SET name = ?, videoUrl = ? WHERE id = 4").run(
    "zaira jewellery", 
    "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218601/ai_story_bracelet_ad_etgcef.mp4"
  );
  // Update the fifth partner to be cinco livings
  db.prepare("UPDATE partners SET name = ?, videoUrl = ? WHERE id = 5").run(
    "cinco livings", 
    "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218610/ugc_ad_og6llh.mp4"
  );
  // Update the sixth partner to be allen town international school
  db.prepare("UPDATE partners SET name = ?, videoUrl = ? WHERE id = 6").run(
    "allen town international school", 
    "https://res.cloudinary.com/dxfgeowvx/video/upload/q_auto/f_auto/v1779218608/school_ad_czugtm.mp4"
  );
  // Delete any other stray copies to avoid duplicates
  db.prepare("DELETE FROM partners WHERE (name = 'zaira stones' OR name = 'grazia stone' OR name = 'plan my interior' OR name = 'vistara infra' OR name = 'zaira jewellery' OR name = 'cinco livings' OR name = 'allen town international school') AND id NOT IN (1, 2, 3, 4, 5, 6)").run();
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

  app.post("/api/gmail-assistant", async (req, res) => {
    try {
      const { action, emailBody, sender, subject, replyTone, description } = req.body;
      if (!ai) {
        return res.status(500).json({ 
          error: "Gemini API client not configured on server. Please ensure GEMINI_API_KEY is configured in Settings > Secrets." 
        });
      }

      let prompt = "";
      if (action === "summarize") {
        prompt = `Please provide a concise, high-impact bulleted summary of this communication thread.\n\nSubject: ${subject}\nFrom: ${sender}\n\nEmail body text:\n${emailBody}`;
      } else if (action === "draft_reply") {
        prompt = `Draft a direct and incredibly professional email reply using a tone of "${replyTone || 'polite and bold'}". Keep the response highly conversion-oriented, focused on scheduling a strategic performance alignment, and use friendly lowercase agency formatting appropriate for 3xHike growth consultants. Avoid generic corporate fluff. Provide details placeholder variables like [My Name] exactly.\n\nOriginal Email Subject: ${subject}\nOriginal Sender: ${sender}\nOriginal Message Content:\n${emailBody}`;
      } else if (action === "compose_new") {
        prompt = `You are a growth copywriter at 3xHike, a premium direct-response video ad agency specialized in 'impossible to ignore' creatives. Compose an outreach email script based on this directive: "${description}". Use friendly lowercase-highlight style, mention we build ads forGrazia Stone and Cinco Livings, make it direct-response oriented, and use standard placeholder tags like [Recipient] or [My Name].`;
      } else {
        return res.status(400).json({ error: "Invalid action type requested" });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ text: response.text || "No output generated." });
    } catch (error: any) {
      console.error("Gemini assistant failed:", error);
      res.status(500).json({ error: error.message || "Failed to process through Gemini models" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, phone, budget, requirement } = req.body;
      const stmt = db.prepare("INSERT INTO leads (name, email, phone, budget, requirement) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(name, email, phone, budget, requirement);

      // Attempt to append to Google Sheets if credentials are provided in env
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); 
      const sheetId = process.env.GOOGLE_SHEET_ID;

      if (serviceAccountEmail && privateKey && sheetId) {
        try {
          const { google } = await import('googleapis');
          const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: serviceAccountEmail,
              private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });
          
          const sheets = google.sheets({ version: 'v4', auth });
          
          let targetSheetName = 'Sheet1';
          try {
            const spreadsheetInfo = await sheets.spreadsheets.get({
              spreadsheetId: sheetId
            });
            if (spreadsheetInfo.data.sheets && spreadsheetInfo.data.sheets.length > 0) {
              const firstSheetName = spreadsheetInfo.data.sheets[0].properties?.title;
              if (firstSheetName) {
                targetSheetName = firstSheetName;
              }
            }
          } catch (getInfoError) {
            console.warn("Could not retrieve spreadsheet metadata, falling back to 'Sheet1':", getInfoError);
          }

          await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${targetSheetName}!A:F`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[name, email, phone, budget, requirement, new Date().toISOString()]],
            },
          });
          console.log(`Successfully appended lead to Google Sheets on tab "${targetSheetName}"`);
        } catch (sheetError) {
          console.error("Error saving lead to Google Sheets:", sheetError);
          // Don't throw here, we still saved it locally
        }
      }

      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error saving lead:", error);
      res.status(500).json({ error: "Failed to save strategy call request" });
    }
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
