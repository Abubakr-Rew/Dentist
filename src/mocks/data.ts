// ============================================================
// TypeScript Interfaces
// ============================================================

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface TimeSlot {
  id: string;
  dentistId: string;
  date: string;       // ISO date string, e.g. "2026-03-26"
  startTime: string;  // "09:00"
  endTime: string;    // "09:30"
  isBooked: boolean;
}

export interface Dentist {
  id: string;
  clinicId: string;
  name: string;
  specialization: string;
  photo: string;
  experience: number; // years
  services: Service[];
  timeSlots: TimeSlot[];
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  image: string;
  description: string;
  dentists: Dentist[];
}

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  clinicId: string;
  dentistId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

// ============================================================
// Helper: Generate time slots for the upcoming 7 days
// ============================================================

function generateSlots(dentistId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  const hours = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  for (let d = 1; d <= 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const iso = date.toISOString().split("T")[0];

    // skip Sunday (0)
    if (date.getDay() === 0) continue;

    for (const h of hours) {
      const [hh, mm] = h.split(":").map(Number);
      const endMm = mm + 30;
      const endTime = `${String(hh + Math.floor(endMm / 60)).padStart(2, "0")}:${String(endMm % 60).padStart(2, "0")}`;

      slots.push({
        id: `${dentistId}-${iso}-${h}`,
        dentistId,
        date: iso,
        startTime: h,
        endTime,
        isBooked: Math.random() < 0.25, // ~25% are already booked
      });
    }
  }
  return slots;
}

// ============================================================
// Mock Data
// ============================================================

export const mockClinics: Clinic[] = [
  {
    id: "clinic-1",
    name: "Smile Clinic",
    address: "ул. Абая 12, офис 3",
    city: "Алматы",
    phone: "+7 (727) 123-45-67",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600",
    description: "Современная стоматологическая клиника с полным спектром услуг. Работаем с 2015 года.",
    dentists: [
      {
        id: "d1",
        clinicId: "clinic-1",
        name: "Dr. Айгуль Нурланова",
        specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
        experience: 10,
        services: [
          { id: "s1", name: "Осмотр и консультация", price: 5000, durationMinutes: 30 },
          { id: "s2", name: "Лечение кариеса", price: 15000, durationMinutes: 60 },
          { id: "s3", name: "Профессиональная чистка", price: 12000, durationMinutes: 45 },
        ],
        timeSlots: generateSlots("d1"),
      },
      {
        id: "d2",
        clinicId: "clinic-1",
        name: "Dr. Асхат Бекмуратов",
        specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200",
        experience: 15,
        services: [
          { id: "s4", name: "Удаление зуба", price: 10000, durationMinutes: 45 },
          { id: "s5", name: "Удаление зуба мудрости", price: 25000, durationMinutes: 90 },
          { id: "s6", name: "Имплантация (1 зуб)", price: 150000, durationMinutes: 120 },
        ],
        timeSlots: generateSlots("d2"),
      },
      {
        id: "d3",
        clinicId: "clinic-1",
        name: "Dr. Динара Сарсенова",
        specialization: "Ортодонт",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200",
        experience: 8,
        services: [
          { id: "s7", name: "Установка брекетов", price: 180000, durationMinutes: 90 },
          { id: "s8", name: "Коррекция брекетов", price: 8000, durationMinutes: 30 },
          { id: "s9", name: "Элайнеры (курс)", price: 350000, durationMinutes: 60 },
        ],
        timeSlots: generateSlots("d3"),
      },
    ],
  },
  {
    id: "clinic-2",
    name: "DentaPro",
    address: "пр. Достык 89",
    city: "Алматы",
    phone: "+7 (727) 987-65-43",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
    description: "Премиум стоматология с использованием новейшего оборудования и материалов из Германии.",
    dentists: [
      {
        id: "d4",
        clinicId: "clinic-2",
        name: "Dr. Марат Касымов",
        specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200",
        experience: 12,
        services: [
          { id: "s10", name: "Осмотр и консультация", price: 7000, durationMinutes: 30 },
          { id: "s11", name: "Лечение кариеса", price: 18000, durationMinutes: 60 },
          { id: "s12", name: "Лечение пульпита", price: 25000, durationMinutes: 90 },
        ],
        timeSlots: generateSlots("d4"),
      },
      {
        id: "d5",
        clinicId: "clinic-2",
        name: "Dr. Жанна Алиева",
        specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200",
        experience: 9,
        services: [
          { id: "s13", name: "Удаление зуба", price: 12000, durationMinutes: 45 },
          { id: "s14", name: "Синус-лифтинг", price: 120000, durationMinutes: 120 },
        ],
        timeSlots: generateSlots("d5"),
      },
    ],
  },
  {
    id: "clinic-3",
    name: "Здоровая Улыбка",
    address: "ул. Сатпаева 22A",
    city: "Астана",
    phone: "+7 (717) 222-33-44",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600",
    description: "Семейная клиника с уютной атмосферой. Принимаем детей и взрослых.",
    dentists: [
      {
        id: "d6",
        clinicId: "clinic-3",
        name: "Dr. Ерлан Тулегенов",
        specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200",
        experience: 20,
        services: [
          { id: "s15", name: "Осмотр и консультация", price: 4000, durationMinutes: 30 },
          { id: "s16", name: "Пломбирование", price: 10000, durationMinutes: 45 },
          { id: "s17", name: "Отбеливание зубов", price: 35000, durationMinutes: 60 },
        ],
        timeSlots: generateSlots("d6"),
      },
      {
        id: "d7",
        clinicId: "clinic-3",
        name: "Dr. Алия Жумабаева",
        specialization: "Ортодонт",
        photo: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=200",
        experience: 7,
        services: [
          { id: "s18", name: "Установка брекетов", price: 160000, durationMinutes: 90 },
          { id: "s19", name: "Капы (ретейнеры)", price: 45000, durationMinutes: 45 },
        ],
        timeSlots: generateSlots("d7"),
      },
      {
        id: "d8",
        clinicId: "clinic-3",
        name: "Dr. Нурсултан Аманов",
        specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200",
        experience: 14,
        services: [
          { id: "s20", name: "Удаление зуба", price: 8000, durationMinutes: 45 },
          { id: "s21", name: "Имплантация (1 зуб)", price: 130000, durationMinutes: 120 },
        ],
        timeSlots: generateSlots("d8"),
      },
    ],
  },
  {
    id: "clinic-4",
    name: "White Dent",
    address: "ул. Жандосова 55",
    city: "Алматы",
    phone: "+7 (727) 555-11-22",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
    description: "Эстетическая стоматология и косметологические процедуры. Работаем без выходных.",
    dentists: [
      {
        id: "d9",
        clinicId: "clinic-4",
        name: "Dr. Камилла Рахимова",
        specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=200",
        experience: 6,
        services: [
          { id: "s22", name: "Осмотр и консультация", price: 6000, durationMinutes: 30 },
          { id: "s23", name: "Виниры (1 зуб)", price: 80000, durationMinutes: 90 },
          { id: "s24", name: "Отбеливание ZOOM", price: 45000, durationMinutes: 60 },
        ],
        timeSlots: generateSlots("d9"),
      },
      {
        id: "d10",
        clinicId: "clinic-4",
        name: "Dr. Бауржан Омаров",
        specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200",
        experience: 11,
        services: [
          { id: "s25", name: "Удаление зуба мудрости", price: 22000, durationMinutes: 90 },
          { id: "s26", name: "Костная пластика", price: 100000, durationMinutes: 120 },
        ],
        timeSlots: generateSlots("d10"),
      },
    ],
  },
  {
    id: "clinic-5",
    name: "MegaDent",
    address: "пр. Республики 14",
    city: "Астана",
    phone: "+7 (717) 777-88-99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600",
    description: "Сеть клиник с филиалами по всему Казахстану. Гарантия на все виды работ до 5 лет.",
    dentists: [
      {
        id: "d11",
        clinicId: "clinic-5",
        name: "Dr. Сауле Кенжебаева",
        specialization: "Терапевт",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
        experience: 13,
        services: [
          { id: "s27", name: "Осмотр и консультация", price: 5500, durationMinutes: 30 },
          { id: "s28", name: "Лечение кариеса", price: 14000, durationMinutes: 60 },
          { id: "s29", name: "Эндодонтическое лечение", price: 30000, durationMinutes: 90 },
        ],
        timeSlots: generateSlots("d11"),
      },
      {
        id: "d12",
        clinicId: "clinic-5",
        name: "Dr. Тимур Исенов",
        specialization: "Ортодонт",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200",
        experience: 10,
        services: [
          { id: "s30", name: "Установка брекетов (метал.)", price: 150000, durationMinutes: 90 },
          { id: "s31", name: "Установка брекетов (керам.)", price: 220000, durationMinutes: 90 },
          { id: "s32", name: "Элайнеры (курс)", price: 400000, durationMinutes: 60 },
        ],
        timeSlots: generateSlots("d12"),
      },
      {
        id: "d13",
        clinicId: "clinic-5",
        name: "Dr. Руслан Жаксыбаев",
        specialization: "Хирург",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200",
        experience: 18,
        services: [
          { id: "s33", name: "Удаление зуба", price: 9000, durationMinutes: 45 },
          { id: "s34", name: "Имплантация Nobel", price: 200000, durationMinutes: 120 },
          { id: "s35", name: "Имплантация Straumann", price: 250000, durationMinutes: 120 },
        ],
        timeSlots: generateSlots("d13"),
      },
    ],
  },
];

// ============================================================
// Mock Appointments (sample data)
// ============================================================

export const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    patientName: "Алексей Иванов",
    patientPhone: "+7 (701) 111-22-33",
    clinicId: "clinic-1",
    dentistId: "d1",
    serviceId: "s2",
    date: "2026-03-27",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
  },
  {
    id: "apt-2",
    patientName: "Мария Петрова",
    patientPhone: "+7 (702) 444-55-66",
    clinicId: "clinic-3",
    dentistId: "d6",
    serviceId: "s17",
    date: "2026-03-28",
    startTime: "14:00",
    endTime: "15:00",
    status: "upcoming",
  },
  {
    id: "apt-3",
    patientName: "Алексей Иванов",
    patientPhone: "+7 (701) 111-22-33",
    clinicId: "clinic-2",
    dentistId: "d4",
    serviceId: "s10",
    date: "2026-03-20",
    startTime: "09:00",
    endTime: "09:30",
    status: "completed",
  },
  {
    id: "apt-4",
    patientName: "Мария Петрова",
    patientPhone: "+7 (702) 444-55-66",
    clinicId: "clinic-1",
    dentistId: "d3",
    serviceId: "s7",
    date: "2026-03-22",
    startTime: "11:00",
    endTime: "12:30",
    status: "completed",
  },
  {
    id: "apt-5",
    patientName: "Дмитрий Ким",
    patientPhone: "+7 (705) 777-88-99",
    clinicId: "clinic-5",
    dentistId: "d13",
    serviceId: "s34",
    date: "2026-03-29",
    startTime: "15:00",
    endTime: "17:00",
    status: "upcoming",
  },
];
