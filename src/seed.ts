import { db } from "./firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // 1. Create a dummy clinic
    // We use a predefined document ID so we can attach dentists to it easily
    const clinicId = "demo_clinic_123";
    await setDoc(doc(db, "users", clinicId), {
      name: "Smiles Dental",
      email: "contact@smiles.com",
      phone: "123-456-7890",
      role: "clinic",
      clinicName: "Smiles Dental",
      address: "123 Main St",
      city: "New York",
      description: "A friendly neighborhood dental clinic.",
      image: "https://via.placeholder.com/150",
      rating: 4.8,
      dentist_count: 2,
      service_ids: ["therapy", "surgery", "orthodontics"], // Generic tags for catalog filtering
      createdAt: new Date().toISOString()
    });
    console.log("Clinic created");

    // 2. Add dentists to the clinic's subcollection
    const dentist1Ref = await addDoc(collection(db, `users/${clinicId}/dentists`), {
      name: "Dr. John Doe",
      specialization: "Orthodontist",
      photo: "https://via.placeholder.com/150",
      experience: 10,
      services: [
        { id: "s1", name: "Braces Consultation", price: 50, duration_minutes: 30 },
        { id: "s2", name: "Teeth Whitening", price: 150, duration_minutes: 60 }
      ]
    });
    console.log("Dentist 1 created");

    const dentist2Ref = await addDoc(collection(db, `users/${clinicId}/dentists`), {
      name: "Dr. Jane Smith",
      specialization: "General Dentist",
      photo: "https://via.placeholder.com/150",
      experience: 5,
      services: [
        { id: "s3", name: "General Checkup", price: 100, duration_minutes: 45 },
        { id: "s4", name: "Cavity Filling", price: 200, duration_minutes: 60 }
      ]
    });
    console.log("Dentist 2 created");

    // 3. Create Available Time Slots for both dentists
    const dentistIds = [dentist1Ref.id, dentist2Ref.id];
    const today = new Date();
    
    // Create slots for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateString = targetDate.toISOString().split('T')[0];

      const timePatterns = [
        { start: "09:00", end: "09:30" },
        { start: "10:00", end: "10:30" },
        { start: "11:00", end: "11:30" },
        { start: "14:00", end: "14:30" },
        { start: "15:00", end: "15:30" },
        { start: "16:00", end: "16:30" }
      ];

      for (const dId of dentistIds) {
        for (const pattern of timePatterns) {
          await addDoc(collection(db, "time_slots"), {
            dentist_id: dId,
            clinic_id: clinicId,
            date: dateString,
            start_time: pattern.start,
            end_time: pattern.end,
            is_booked: false
          });
        }
      }
    }
    console.log("Time slots created for 7 days");

    alert("Firebase database seeded successfully! Refresh the page.");

  } catch (error) {
    console.error("Error seeding database:", error);
    alert("Error seeding database check console.");
  }
}
