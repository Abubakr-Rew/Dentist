// ── Auth ─────────────────────────────────────────────────────────────────────
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AuthUser {
  id: string | number; // Firebase uses strings for IDs
  name: string;
  email: string;
  role: "patient" | "clinic";
  // Extra fields that could exist based on role
  clinicName?: string;
  address?: string;
  city?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: async (email: string, password: string, _role?: string): Promise<AuthResponse> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    
    if (!userDoc.exists()) {
       throw new Error("User record not found in database.");
    }
    
    // Check if role matches if role was explicitly provided
    if (_role && userDoc.data().role !== _role) {
       throw new Error("Invalid role.");
    }

    const userData = userDoc.data() as Omit<AuthUser, "id">;
    return {
      token: await cred.user.getIdToken(),
      user: { id: cred.user.uid, ...userData } as AuthUser
    };
  },

  register: async (data: {
    name: string; email: string; phone: string; password: string; role: string;
    clinicName?: string; address?: string; city?: string;
  }): Promise<AuthResponse> => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    let docData: any = {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      role: data.role || "patient",
      createdAt: new Date().toISOString()
    };
    
    if (data.role === "clinic") {
      docData = {
        ...docData,
        clinicName: data.clinicName || "",
        address: data.address || "",
      	city: data.city || "",
        description: "",
        image: "",
        rating: 0,
        dentist_count: 0
      };
    }
    
    await setDoc(doc(db, "users", cred.user.uid), docData);

    return {
      token: await cred.user.getIdToken(),
      user: { id: cred.user.uid, ...docData } as AuthUser
    };
  },

  me: async (): Promise<{ user: AuthUser }> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user logged in");
    
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (!userDoc.exists()) throw new Error("User data not found in DB");
    
    return { user: { id: currentUser.uid, ...userDoc.data() } as AuthUser };
  },
};

// ── Clinics ───────────────────────────────────────────────────────────────────
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, increment } from "firebase/firestore";

export interface ClinicSummary {
  id: string | number;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  image: string;
  description: string;
  dentist_count: number;
  clinicName?: string;
  service_ids: string[];
}

export interface Service {
  id: string | number;
  name: string;
  price: number;
  duration_minutes: number;
}

export interface Dentist {
  id: string | number;
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
  list: async (search = "", city = "") => {
    let q = query(collection(db, "users"), where("role", "==", "clinic"));
    if (city) {
      q = query(q, where("city", "==", city));
    }
    const snap = await getDocs(q);
    let clinics = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    // Client-side text search (Firestore doesn't natively support substring search easily)
    if (search) {
      const s = search.toLowerCase();
      clinics = clinics.filter(c => 
        (c.name && c.name.toLowerCase().includes(s)) || 
        (c.clinicName && c.clinicName.toLowerCase().includes(s))
      );
    }
    return clinics as ClinicSummary[];
  },

  get: async (id: number | string) => {
    const docRef = doc(db, "users", String(id));
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Clinic not found");
    
    const clinic = { id: snap.id, ...snap.data() } as any;
    
    // fetch nested dentists from sub-collection
    const dentistsSnap = await getDocs(collection(db, `users/${id}/dentists`));
    clinic.dentists = dentistsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    return clinic as ClinicDetail;
  },

  updateClinic: async (id: string, data: Partial<ClinicSummary>) => {
    await updateDoc(doc(db, "users", id), data);
  },

  addDentist: async (clinicId: string, dentistData: Omit<Dentist, "id">) => {
    const docRef = await addDoc(collection(db, `users/${clinicId}/dentists`), dentistData);
    // Increment dentist_count on the clinic document
    await updateDoc(doc(db, "users", clinicId), { dentist_count: increment(1) });
    return { id: docRef.id };
  },

  updateDentist: async (clinicId: string, dentistId: string, data: Partial<Dentist>) => {
    await updateDoc(doc(db, `users/${clinicId}/dentists`, dentistId), data);
  },

  addServiceToDentist: async (clinicId: string, dentistId: string, service: Service) => {
    const dentistRef = doc(db, `users/${clinicId}/dentists`, dentistId);
    const snap = await getDoc(dentistRef);
    if (!snap.exists()) throw new Error("Dentist not found");
    const existing = snap.data().services || [];
    await updateDoc(dentistRef, { services: [...existing, service] });
  },

  getSlots: async (clinicId: string, dentistId: string) => {
    const q = query(
      collection(db, "time_slots"),
      where("clinic_id", "==", clinicId),
      where("dentist_id", "==", dentistId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any)) as (TimeSlot & { clinic_id: string })[];
  },

  addTimeSlots: async (clinicId: string, dentistId: string, dates: string[], times: {start: string, end: string}[]) => {
    for (const date of dates) {
      for (const time of times) {
        await addDoc(collection(db, "time_slots"), {
          clinic_id: clinicId,
          dentist_id: dentistId,
          date,
          start_time: time.start,
          end_time: time.end,
          is_booked: false
        });
      }
    }
  }
};

// ── Dentists ──────────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: string | number;
  dentist_id: string | number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export const dentistsApi = {
  slots: async (dentistId: number | string, date?: string) => {
    let q = query(
      collection(db, "time_slots"), 
      where("dentist_id", "==", String(dentistId)), 
      where("is_booked", "==", false)
    );
    
    if (date) {
      q = query(q, where("date", "==", date));
    }
    const snap = await getDocs(q);
    const allSlots = snap.docs.map(d => ({ id: d.id, ...d.data() } as any)) as TimeSlot[];

    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    const currentHourStr = now.toTimeString().slice(0, 5); // "HH:MM"

    return allSlots.filter(slot => {
      if (slot.date < currentDateStr) return false;
      if (slot.date === currentDateStr && slot.start_time <= currentHourStr) return false;
      return true;
    });
  },
};

// ── Appointments ──────────────────────────────────────────────────────────────

export interface PatientAppointment {
  id: string | number;
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
  id: string | number;
  date: string;
  start_time: string;
  end_time: string;
  status: "upcoming" | "completed" | "cancelled";
  patient_name: string;
  patient_phone: string;
  dentist_name: string;
  service_name: string;
  price: number;
  time_slot_id?: string;
  clinic_id?: string;
}

export const appointmentsApi = {
  book: async (data: { dentist_id: number|string; service_id: number|string; time_slot_id: number|string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    
    // Fetch slot info
    const slotSnap = await getDoc(doc(db, "time_slots", String(data.time_slot_id)));
    if (!slotSnap.exists()) throw new Error("Slot not found");
    const slotData = slotSnap.data();
    if (slotData.is_booked) throw new Error("Slot unavailable");

    // Fetch user (patient) info
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const userData = userSnap.data() as any;

    // Fetch clinic info
    const clinicSnap = await getDoc(doc(db, "users", slotData.clinic_id));
    const clinicData = clinicSnap.data() as any;

    // Fetch dentist info
    const dentistSnap = await getDoc(doc(db, `users/${slotData.clinic_id}/dentists`, String(data.dentist_id)));
    const dentistData = dentistSnap.data() as any;

    // Find service
    const service = dentistData.services?.find((s: any) => String(s.id) === String(data.service_id));

    const docRef = await addDoc(collection(db, "appointments"), {
      patient_id: user.uid,
      patient_name: userData.name || "Пациент",
      patient_phone: userData.phone || "",
      clinic_id: slotData.clinic_id,
      clinic_name: clinicData.clinicName || clinicData.name || "Клиника",
      clinic_address: clinicData.address || "",
      clinic_city: clinicData.city || "",
      dentist_id: String(data.dentist_id),
      dentist_name: dentistData.name || "Врач",
      specialization: dentistData.specialization || "",
      service_id: String(data.service_id),
      service_name: service?.name || "",
      price: service?.price || 0,
      time_slot_id: String(data.time_slot_id),
      date: slotData.date,
      start_time: slotData.start_time,
      end_time: slotData.end_time,
      status: "upcoming",
      createdAt: new Date().toISOString()
    });
    
    // Mark slot as booked
    await updateDoc(doc(db, "time_slots", String(data.time_slot_id)), { is_booked: true });
    
    return { id: docRef.id };
  },

  myAppointments: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const q = query(collection(db, "appointments"), where("patient_id", "==", user.uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any)) as PatientAppointment[];
  },

  clinicAppointments: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    // A clinic user needs to pull appointments where clinic_id matches. 
    // This assumes when an appointment is booked, clinic_id is included.
    const q = query(collection(db, "appointments"), where("clinic_id", "==", user.uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any)) as ClinicAppointment[];
  },

  updateStatus: async (id: number | string, status: string) => {
    await updateDoc(doc(db, "appointments", String(id)), { status });
  },

  cancel: async (id: number | string) => {
    await deleteDoc(doc(db, "appointments", String(id)));
  },
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  updateProfile: async (data: { name?: string; phone?: string; birthDate?: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    await updateDoc(doc(db, "users", user.uid), data);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Not authenticated");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  },
};
