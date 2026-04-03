const router = require("express").Router();
const pool = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

// POST /api/appointments  — book an appointment (patient only)
router.post("/", requireAuth, requireRole("patient"), async (req, res) => {
  const { dentist_id, service_id, time_slot_id } = req.body;
  const patient_id = req.user.id;

  if (!dentist_id || !service_id || !time_slot_id) {
    return res.status(400).json({ error: "Укажите врача, услугу и время" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock and check slot
    const slotRes = await client.query(
      "SELECT * FROM time_slots WHERE id=$1 FOR UPDATE",
      [time_slot_id]
    );
    const slot = slotRes.rows[0];
    if (!slot) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Слот не найден" });
    }
    if (slot.is_booked) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Этот слот уже занят" });
    }

    // Get clinic_id from dentist
    const dentistRes = await client.query("SELECT clinic_id FROM dentists WHERE id=$1", [dentist_id]);
    if (!dentistRes.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Врач не найден" });
    }
    const clinic_id = dentistRes.rows[0].clinic_id;

    // Create appointment
    const apptRes = await client.query(
      `INSERT INTO appointments (patient_id, clinic_id, dentist_id, service_id, time_slot_id, date, start_time, end_time, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'upcoming') RETURNING *`,
      [patient_id, clinic_id, dentist_id, service_id, time_slot_id, slot.date, slot.start_time, slot.end_time]
    );

    // Mark slot as booked
    await client.query("UPDATE time_slots SET is_booked=true WHERE id=$1", [time_slot_id]);

    await client.query("COMMIT");
    res.status(201).json(apptRes.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    client.release();
  }
});

// GET /api/appointments/my  — patient's own appointments
router.get("/my", requireAuth, requireRole("patient"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.date, a.start_time, a.end_time, a.status,
              c.name AS clinic_name, c.address AS clinic_address, c.city AS clinic_city,
              d.name AS dentist_name, d.specialization,
              s.name AS service_name, s.price
       FROM appointments a
       JOIN clinics  c ON c.id = a.clinic_id
       JOIN dentists d ON d.id = a.dentist_id
       LEFT JOIN services s ON s.id = a.service_id
       WHERE a.patient_id = $1
       ORDER BY a.date DESC, a.start_time DESC`,
      [req.user.id]
    );
    const rows = result.rows.map(r => ({
      ...r,
      date: r.date instanceof Date ? r.date.toISOString().split("T")[0] : String(r.date),
      start_time: String(r.start_time).slice(0, 5),
      end_time: String(r.end_time).slice(0, 5),
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /api/appointments/clinic  — clinic's appointments (clinic role)
router.get("/clinic", requireAuth, requireRole("clinic"), async (req, res) => {
  try {
    // Find clinic owned by this user
    const clinicRes = await pool.query("SELECT id FROM clinics WHERE user_id=$1", [req.user.id]);
    if (!clinicRes.rows[0]) return res.status(404).json({ error: "Клиника не найдена" });
    const clinicId = clinicRes.rows[0].id;

    const result = await pool.query(
      `SELECT a.id, a.date, a.start_time, a.end_time, a.status,
              u.name AS patient_name, u.phone AS patient_phone,
              d.name AS dentist_name,
              s.name AS service_name, s.price
       FROM appointments a
       JOIN users    u ON u.id = a.patient_id
       JOIN dentists d ON d.id = a.dentist_id
       LEFT JOIN services s ON s.id = a.service_id
       WHERE a.clinic_id = $1
       ORDER BY a.date DESC, a.start_time DESC`,
      [clinicId]
    );
    const rows = result.rows.map(r => ({
      ...r,
      date: r.date instanceof Date ? r.date.toISOString().split("T")[0] : String(r.date),
      start_time: String(r.start_time).slice(0, 5),
      end_time: String(r.end_time).slice(0, 5),
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// PATCH /api/appointments/:id/status  — clinic updates status
router.patch("/:id/status", requireAuth, requireRole("clinic"), async (req, res) => {
  const { status } = req.body;
  if (!["upcoming", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Недопустимый статус" });
  }

  try {
    const clinicRes = await pool.query("SELECT id FROM clinics WHERE user_id=$1", [req.user.id]);
    if (!clinicRes.rows[0]) return res.status(404).json({ error: "Клиника не найдена" });
    const clinicId = clinicRes.rows[0].id;

    const result = await pool.query(
      `UPDATE appointments SET status=$1 WHERE id=$2 AND clinic_id=$3 RETURNING *`,
      [status, req.params.id, clinicId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Запись не найдена" });

    // If cancelled, free the time slot
    if (status === "cancelled" && result.rows[0].time_slot_id) {
      await pool.query("UPDATE time_slots SET is_booked=false WHERE id=$1", [result.rows[0].time_slot_id]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// DELETE /api/appointments/:id  — patient cancels their own appointment
router.delete("/:id", requireAuth, requireRole("patient"), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE appointments SET status='cancelled' WHERE id=$1 AND patient_id=$2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Запись не найдена" });
    }
    // Free the slot
    if (result.rows[0].time_slot_id) {
      await client.query("UPDATE time_slots SET is_booked=false WHERE id=$1", [result.rows[0].time_slot_id]);
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    client.release();
  }
});

module.exports = router;
