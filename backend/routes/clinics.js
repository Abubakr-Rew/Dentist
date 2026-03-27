const router = require("express").Router();
const pool = require("../db");

// GET /api/clinics?search=&city=
router.get("/", async (req, res) => {
  const { search = "", city = "" } = req.query;
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.address, c.city, c.phone, c.rating, c.image, c.description,
              COUNT(d.id)::int AS dentist_count
       FROM clinics c
       LEFT JOIN dentists d ON d.clinic_id = c.id
       WHERE ($1 = '' OR c.name ILIKE $1 OR c.city ILIKE $1)
         AND ($2 = '' OR c.city ILIKE $2)
       GROUP BY c.id
       ORDER BY c.rating DESC`,
      [`%${search}%`, `%${city}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /api/clinics/:id  — full clinic with dentists, services
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const clinicRes = await pool.query(
      `SELECT id, name, address, city, phone, rating, image, description FROM clinics WHERE id=$1`,
      [id]
    );
    if (clinicRes.rows.length === 0) return res.status(404).json({ error: "Клиника не найдена" });
    const clinic = clinicRes.rows[0];

    const dentistsRes = await pool.query(
      `SELECT d.id, d.name, d.specialization, d.photo, d.experience,
              json_agg(json_build_object('id', s.id, 'name', s.name, 'price', s.price, 'duration_minutes', s.duration_minutes)
                       ORDER BY s.id) AS services
       FROM dentists d
       LEFT JOIN services s ON s.dentist_id = d.id
       WHERE d.clinic_id = $1
       GROUP BY d.id
       ORDER BY d.id`,
      [id]
    );

    clinic.dentists = dentistsRes.rows;
    res.json(clinic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
