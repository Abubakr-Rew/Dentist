import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CaretLeft } from "@phosphor-icons/react";
import { clinicsApi, dentistsApi, appointmentsApi } from "../services/api";
import type { TimeSlot, ClinicDetail, Dentist } from "../services/api";
import { Button } from "../components/ui";
import BookingCalendar from "../components/booking/BookingCalendar";
import BookingSummary from "../components/booking/BookingSummary";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const clinicId = searchParams.get("clinic");
  const serviceId = searchParams.get("service");
  const dentistId = searchParams.get("dentist");

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  const [clinic, setClinic] = useState<ClinicDetail | null>(null);
  const [dentist, setDentist] = useState<Dentist | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId || !dentistId) {
      setLoading(false);
      return;
    }

    Promise.all([
      clinicsApi.get(clinicId),
      dentistsApi.slots(dentistId)
    ])
    .then(([fetchedClinic, fetchedSlots]) => {
      setClinic(fetchedClinic);
      setDentist(fetchedClinic.dentists.find(d => String(d.id) === String(dentistId)) || null);
      setTimeSlots(fetchedSlots);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [clinicId, dentistId]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
        Подготовка записи...
      </div>
    );
  }

  if (!clinic || !dentist) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ошибка записи</h2>
        <p className="text-slate-500 mb-6">Не удалось найти данные для записи. Возможно, ссылка устарела.</p>
        <Button onClick={() => navigate("/clinics")}>Вернуться к клиникам</Button>
      </div>
    );
  }

  const handleConfirm = async (data: { patientName: string; patientPhone: string; serviceId: string; addonIds: string[] }) => {
    try {
      if (!selectedSlot || !dentistId) return;
      await appointmentsApi.book({
        dentist_id: String(dentistId),
        service_id: String(data.serviceId),
        time_slot_id: String(selectedSlot.id)
      });
      
      navigate("/booking/success", { 
        state: { 
          clinicId, 
          dentistId, 
          serviceId: data.serviceId, 
          addonIds: data.addonIds,
          slot: selectedSlot,
          patientName: data.patientName,
          patientPhone: data.patientPhone
        } 
      });
    } catch (err) {
      console.error("Booking error:", err);
      alert("Ошибка при бронировании! Пожалуйста, убедитесь, что вы авторизованы.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      {!selectedSlot && (
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <CaretLeft size={24} weight="bold" />
          </button>
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900">Выбор времени записи</h1>
        </div>
      )}

      <div className="bg-white p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {!selectedSlot ? (
          <BookingCalendar 
            timeSlots={timeSlots} 
            onContinue={(slot) => setSelectedSlot(slot)} 
          />
        ) : (
          <BookingSummary
            clinic={clinic as any}
            dentist={dentist as any}
            date={selectedSlot.date}
            timeSlot={selectedSlot}
            initialServiceId={serviceId}
            onConfirm={handleConfirm}
            onBack={() => setSelectedSlot(null)}
          />
        )}
      </div>
    </div>
  );
}
