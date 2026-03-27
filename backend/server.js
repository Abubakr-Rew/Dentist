require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pool = require("./db");

const authRoutes = require("./routes/auth");
const clinicsRoutes = require("./routes/clinics");
const dentistsRoutes = require("./routes/dentists");
const appointmentsRoutes = require("./routes/appointments");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicsRoutes);
app.use("/api/dentists", dentistsRoutes);
app.use("/api/appointments", appointmentsRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ── Auto-migrate + seed on startup (like Spring) ─────────────────────────────

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, "db/schema.sql"), "utf8");
  await pool.query(schema);
  console.log("✓ Schema applied");
}

async function seedIfEmpty() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM clinics");
  if (rows[0].count > 0) {
    console.log("✓ Database already seeded, skipping");
    return;
  }
  // Dynamically run seed logic (reuse seed.js exports)
  await require("./db/seed").run(pool);
  console.log("✓ Database seeded");
}

async function start() {
  try {
    await migrate();
    await seedIfEmpty();
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

start();
