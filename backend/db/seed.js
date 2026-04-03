require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const clinics = [
  {
    name: "Smile Clinic",
    address: "ул. Абая 12, офис 3",
    city: "Алматы",
    phone: "+7 (727) 123-45-67",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600",
    description: "Современная стоматологическая клиника с полным спектром услуг. Работаем с 2015 года.",
    dentists: [
      {
        name: "Dr. Айгуль Нурланова", specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200", experience: 10,
        services: [
          { name: "Осмотр и консультация", price: 5000, duration_minutes: 30 },
          { name: "Лечение кариеса", price: 15000, duration_minutes: 60 },
          { name: "Профессиональная чистка", price: 12000, duration_minutes: 45 },
        ],
      },
      {
        name: "Dr. Асхат Бекмуратов", specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200", experience: 15,
        services: [
          { name: "Удаление зуба", price: 10000, duration_minutes: 45 },
          { name: "Удаление зуба мудрости", price: 25000, duration_minutes: 90 },
          { name: "Имплантация (1 зуб)", price: 150000, duration_minutes: 120 },
        ],
      },
      {
        name: "Dr. Динара Сарсенова", specialization: "Ортодонт",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200", experience: 8,
        services: [
          { name: "Установка брекетов", price: 180000, duration_minutes: 90 },
          { name: "Коррекция брекетов", price: 8000, duration_minutes: 30 },
          { name: "Элайнеры (курс)", price: 350000, duration_minutes: 60 },
        ],
      },
    ],
  },
  {
    name: "DentaPro",
    address: "пр. Достык 89",
    city: "Алматы",
    phone: "+7 (727) 987-65-43",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
    description: "Премиум стоматология с использованием новейшего оборудования и материалов из Германии.",
    dentists: [
      {
        name: "Dr. Марат Касымов", specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200", experience: 12,
        services: [
          { name: "Осмотр и консультация", price: 7000, duration_minutes: 30 },
          { name: "Лечение кариеса", price: 18000, duration_minutes: 60 },
          { name: "Лечение пульпита", price: 25000, duration_minutes: 90 },
        ],
      },
      {
        name: "Dr. Жанна Алиева", specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200", experience: 9,
        services: [
          { name: "Удаление зуба", price: 12000, duration_minutes: 45 },
          { name: "Синус-лифтинг", price: 120000, duration_minutes: 120 },
        ],
      },
    ],
  },
  {
    name: "Здоровая Улыбка",
    address: "ул. Сатпаева 22A",
    city: "Астана",
    phone: "+7 (717) 222-33-44",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600",
    description: "Семейная клиника с уютной атмосферой. Принимаем детей и взрослых.",
    dentists: [
      {
        name: "Dr. Ерлан Тулегенов", specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200", experience: 20,
        services: [
          { name: "Осмотр и консультация", price: 4000, duration_minutes: 30 },
          { name: "Пломбирование", price: 10000, duration_minutes: 45 },
          { name: "Отбеливание зубов", price: 35000, duration_minutes: 60 },
        ],
      },
      {
        name: "Dr. Алия Жумабаева", specialization: "Ортодонт",
        photo: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=200", experience: 7,
        services: [
          { name: "Установка брекетов", price: 160000, duration_minutes: 90 },
          { name: "Капы (ретейнеры)", price: 45000, duration_minutes: 45 },
        ],
      },
      {
        name: "Dr. Нурсултан Аманов", specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200", experience: 14,
        services: [
          { name: "Удаление зуба", price: 8000, duration_minutes: 45 },
          { name: "Имплантация (1 зуб)", price: 130000, duration_minutes: 120 },
        ],
      },
    ],
  },
  {
    name: "White Dent",
    address: "ул. Жандосова 55",
    city: "Алматы",
    phone: "+7 (727) 555-11-22",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1629909615032-9d402ab68eb7?w=600",
    description: "Эстетическая стоматология и косметологические процедуры. Работаем без выходных.",
    dentists: [
      {
        name: "Dr. Камилла Рахимова", specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200", experience: 6,
        services: [
          { name: "Осмотр и консультация", price: 6000, duration_minutes: 30 },
          { name: "Виниры (1 зуб)", price: 80000, duration_minutes: 90 },
          { name: "Отбеливание ZOOM", price: 45000, duration_minutes: 60 },
        ],
      },
      {
        name: "Dr. Бауржан Омаров", specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200", experience: 11,
        services: [
          { name: "Удаление зуба мудрости", price: 22000, duration_minutes: 90 },
          { name: "Костная пластика", price: 100000, duration_minutes: 120 },
        ],
      },
    ],
  },
  {
    name: "MegaDent",
    address: "пр. Республики 14",
    city: "Астана",
    phone: "+7 (717) 777-88-99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600",
    description: "Сеть клиник с филиалами по всему Казахстану. Гарантия на все виды работ до 5 лет.",
    dentists: [
      {
        name: "Dr. Сауле Кенжебаева", specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200", experience: 13,
        services: [
          { name: "Осмотр и консультация", price: 5500, duration_minutes: 30 },
          { name: "Лечение кариеса", price: 14000, duration_minutes: 60 },
          { name: "Эндодонтическое лечение", price: 30000, duration_minutes: 90 },
        ],
      },
      {
        name: "Dr. Тимур Исенов", specialization: "Ортодонт",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200", experience: 10,
        services: [
          { name: "Установка брекетов (метал.)", price: 150000, duration_minutes: 90 },
          { name: "Установка брекетов (керам.)", price: 220000, duration_minutes: 90 },
          { name: "Элайнеры (курс)", price: 400000, duration_minutes: 60 },
        ],
      },
      {
        name: "Dr. Руслан Жаксыбаев", specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200", experience: 18,
        services: [
          { name: "Удаление зуба", price: 9000, duration_minutes: 45 },
          { name: "Имплантация Nobel", price: 200000, duration_minutes: 120 },
          { name: "Имплантация Straumann", price: 250000, duration_minutes: 120 },
        ],
      },
    ],
  },
];

function generateSlots(dentistId) {
  const slots = [];
  const hours = [
    ["09:00", "09:30"], ["09:30", "10:00"], ["10:00", "10:30"], ["10:30", "11:00"],
    ["11:00", "11:30"], ["11:30", "12:00"], ["14:00", "14:30"], ["14:30", "15:00"],
    ["15:00", "15:30"], ["15:30", "16:00"], ["16:00", "16:30"], ["16:30", "17:00"],
  ];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0) continue;
    const iso = date.toISOString().split("T")[0];
    for (const [start, end] of hours) {
      slots.push({ dentist_id: dentistId, date: iso, start_time: start, end_time: end, is_booked: Math.random() < 0.25 });
    }
  }
  return slots;
}

// Called by server.js on startup when DB is empty
async function run(pool) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const clinicData of clinics) {
      const clinicRes = await client.query(
        `INSERT INTO clinics (name, address, city, phone, rating, image, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [clinicData.name, clinicData.address, clinicData.city, clinicData.phone,
         clinicData.rating, clinicData.image, clinicData.description]
      );
      const clinicId = clinicRes.rows[0].id;

      for (const dentistData of clinicData.dentists) {
        const dentistRes = await client.query(
          `INSERT INTO dentists (clinic_id, name, specialization, photo, experience)
           VALUES ($1,$2,$3,$4,$5) RETURNING id`,
          [clinicId, dentistData.name, dentistData.specialization, dentistData.photo, dentistData.experience]
        );
        const dentistId = dentistRes.rows[0].id;

        for (const svc of dentistData.services) {
          await client.query(
            `INSERT INTO services (dentist_id, name, price, duration_minutes) VALUES ($1,$2,$3,$4)`,
            [dentistId, svc.name, svc.price, svc.duration_minutes]
          );
        }

        for (const slot of generateSlots(dentistId)) {
          await client.query(
            `INSERT INTO time_slots (dentist_id, date, start_time, end_time, is_booked)
             VALUES ($1,$2,$3,$4,$5) ON CONFLICT (dentist_id, date, start_time) DO NOTHING`,
            [slot.dentist_id, slot.date, slot.start_time, slot.end_time, slot.is_booked]
          );
        }
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Allow running directly: node db/seed.js
if (require.main === module) {
  const pool = require("./index");
  run(pool)
    .then(() => { console.log("Seed complete!"); process.exit(0); })
    .catch((err) => { console.error("Seed failed:", err); process.exit(1); });
}

module.exports = { run };
