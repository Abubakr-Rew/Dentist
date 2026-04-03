const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "patient" | "clinic";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string, role: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    }),

  register: (data: {
    name: string; email: string; phone: string; password: string; role: string;
    clinicName?: string; address?: string; city?: string;
  }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: AuthUser }>("/auth/me"),
};

// ── Clinics ───────────────────────────────────────────────────────────────────

export interface ClinicSummary {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  image: string;
  description: string;
  dentist_count: number;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
}

export interface Dentist {
  id: number;
  name: string;
  specialization: string;
  photo: string;
  experience: number;
  services: Service[];
}

export interface ClinicDetail extends Omit<ClinicSummary, "dentist_count"> {
  dentists: Dentist[];
}

export const clinicsApi = {
  list: (search = "", city = "") =>
    request<ClinicSummary[]>(`/clinics?search=${encodeURIComponent(search)}&city=${encodeURIComponent(city)}`),

  get: (id: number | string) => request<ClinicDetail>(`/clinics/${id}`),
};

// ── Dentists ──────────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: number;
  dentist_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export const dentistsApi = {
  slots: (dentistId: number | string, date?: string) =>
    request<TimeSlot[]>(`/dentists/${dentistId}/slots${date ? `?date=${date}` : ""}`),
};

// ── Appointments ──────────────────────────────────────────────────────────────

export interface PatientAppointment {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "upcoming" | "completed" | "cancelled";
  clinic_name: string;
  clinic_address: string;
  clinic_city: string;
  dentist_name: string;
  specialization: string;
  service_name: string;
  price: number;
}

export interface ClinicAppointment {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "upcoming" | "completed" | "cancelled";
  patient_name: string;
  patient_phone: string;
  dentist_name: string;
  service_name: string;
  price: number;
}

export const appointmentsApi = {
  book: (data: { dentist_id: number; service_id: number; time_slot_id: number }) =>
    request<{ id: number }>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  myAppointments: () => request<PatientAppointment[]>("/appointments/my"),

  clinicAppointments: () => request<ClinicAppointment[]>("/appointments/clinic"),

  updateStatus: (id: number, status: string) =>
    request(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  cancel: (id: number) =>
    request(`/appointments/${id}`, { method: "DELETE" }),
};
