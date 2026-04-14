import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CaretLeft } from "@phosphor-icons/react";
import { mockClinics, TimeSlot } from "../mocks/data";
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

  // Validate data
  const clinic = mockClinics.find(c => c.id === clinicId);
  const dentist = clinic?.dentists.find(d => d.id === dentistId);
  
  if (!clinic || !dentist) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ошибка записи</h2>
        <p className="text-slate-500 mb-6">Не удалось найти данные для записи. Возможно, ссылка устарела.</p>
        <Button onClick={() => navigate("/clinics")}>Вернуться к клиникам</Button>
      </div>
    );
  }

  const handleConfirm = (data: { patientName: string; patientPhone: string; serviceId: string; addonIds: string[] }) => {
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
            timeSlots={dentist.timeSlots} 
            onContinue={(slot) => setSelectedSlot(slot)} 
          />
        ) : (
          <BookingSummary
            clinic={clinic}
            dentist={dentist}
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
