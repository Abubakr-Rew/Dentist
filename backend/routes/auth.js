const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, phone, password, role, clinicName, address, city } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Заполните все обязательные поля" });
  }
  if (!["patient", "clinic"].includes(role)) {
    return res.status(400).json({ error: "Недопустимая роль" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Email уже зарегистрирован" });
    }

    const hash = await bcrypt.hash(password, 10);
    const userRes = await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role`,
      [name, email, phone || null, hash, role]
    );
    const user = userRes.rows[0];

    // If registering as a clinic, create the clinic record
    if (role === "clinic") {
      if (!clinicName || !address) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Укажите название и адрес клиники" });
      }
      await client.query(
        `INSERT INTO clinics (user_id, name, address, city, phone) VALUES ($1,$2,$3,$4,$5)`,
        [user.id, clinicName, address, city || "Алматы", phone || null]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Введите email и пароль" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email=$1",
      [email]
    );
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Неверный email или пароль" });
    if (role && user.role !== role) return res.status(403).json({ error: "Неверная роль для этого аккаунта" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Неверный email или пароль" });

    res.json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /api/auth/me  (validate token & return user)
router.get("/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Не авторизован" });
  const jwt2 = require("jsonwebtoken");
  try {
    const payload = jwt2.verify(header.slice(7), process.env.JWT_SECRET);
    res.json({ user: { id: payload.id, name: payload.name, email: payload.email, role: payload.role } });
  } catch {
    res.status(401).json({ error: "Токен недействителен" });
  }
});

module.exports = router;
