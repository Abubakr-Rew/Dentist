const router = require("express").Router();
const pool = require("../db");

// GET /api/dentists/:id/slots?date=YYYY-MM-DD
router.get("/:id/slots", async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    let query, params;

    if (date) {
      query = `SELECT id, dentist_id, date, start_time, end_time, is_booked
               FROM time_slots WHERE dentist_id=$1 AND date=$2 ORDER BY start_time`;
      params = [id, date];
    } else {
      // Return slots for next 14 days
      query = `SELECT id, dentist_id, date, start_time, end_time, is_booked
               FROM time_slots
               WHERE dentist_id=$1 AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '14 days'
               ORDER BY date, start_time`;
      params = [id];
    }

    const result = await pool.query(query, params);

    // Format times as "HH:MM" strings
    const slots = result.rows.map(row => ({
      ...row,
      date: row.date instanceof Date ? row.date.toISOString().split("T")[0] : String(row.date),
      start_time: String(row.start_time).slice(0, 5),
      end_time: String(row.end_time).slice(0, 5),
    }));

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
