import { useState, useEffect } from "react";
import { CalendarPlus, X, CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";
import { ClinicDetail as Clinic, clinicsApi, TimeSlot } from "../../services/api";
import type { ClinicAppointment } from "../../services/api";
import { Button, Card, CardContent, Input } from "../ui";

interface ClinicSlotsTabProps {
  clinic: Clinic;
  appointments: ClinicAppointment[];
}

export default function ClinicSlotsTab({ clinic, appointments }: ClinicSlotsTabProps) {
  const [selectedDentistId, setSelectedDentistId] = useState<string>(
    clinic.dentists.length > 0 ? String(clinic.dentists[0].id) : ""
  );
  const [slots, setSlots] = useState<(TimeSlot & { clinic_id?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBooked, setShowBooked] = useState(true);

  // Generate slots
  const [isGenerating, setIsGenerating] = useState(false);
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split("T")[0]);
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Load slots when dentist changes
  useEffect(() => {
    if (!selectedDentistId) return;
    setLoading(true);
    clinicsApi
      .getSlots(String(clinic.id), selectedDentistId)
      .then((data) => {
        const sorted = data.sort(
          (a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)
        );
        setSlots(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedDentistId, clinic.id, successMsg]);

  const handleGenerate = async () => {
    if (!selectedDentistId) return;
    try {
      const times = [
        { start: "09:00", end: "09:30" },
        { start: "10:00", end: "10:30" },
        { start: "11:00", end: "11:30" },
        { start: "12:00", end: "12:30" },
        { start: "14:00", end: "14:30" },
        { start: "15:00", end: "15:30" },
        { start: "16:00", end: "16:30" },
        { start: "17:00", end: "17:30" },
      ];
      await clinicsApi.addTimeSlots(String(clinic.id), selectedDentistId, [slotDate], times);
      setIsGenerating(false);
      showSuccess("Слоты сгенерированы!");
    } catch (e) {
      console.error(e);
      alert("Ошибка при генерации");
    }
  };

  const filteredSlots = showBooked ? slots : slots.filter((s) => !s.is_booked);
  const selectedDentist = clinic.dentists.find((d) => String(d.id) === selectedDentistId);

  // Group slots by date
  const groupedSlots: Record<string, typeof filteredSlots> = {};
  for (const slot of filteredSlots) {
    if (!groupedSlots[slot.date]) groupedSlots[slot.date] = [];
    groupedSlots[slot.date].push(slot);
  }

  // Build a lookup: slotId -> appointment info
  const slotAppointmentMap = new Map<string, ClinicAppointment>();
  for (const apt of appointments) {
    if (apt.time_slot_id) {
      slotAppointmentMap.set(String(apt.time_slot_id), apt);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-50 border border-emerald-200 text-emerald-600 px-5 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} weight="fill" />
          {successMsg}
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Управление слотами</h1>
          <p className="text-sm text-slate-500 font-medium">Просмотр и генерация временных слотов для врачей</p>
        </div>
        <Button className="font-bold gap-2" onClick={() => setIsGenerating(true)}>
          <CalendarPlus size={16} weight="bold" />
          Сгенерировать слоты
        </Button>
      </header>

      {/* Dentist Selector + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedDentistId}
          onChange={(e) => setSelectedDentistId(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1"
        >
          {clinic.dentists.map((d) => (
            <option key={d.id} value={String(d.id)}>
              {d.name} — {d.specialization}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowBooked(!showBooked)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
            showBooked
              ? "bg-white border-slate-200 text-slate-600"
              : "bg-primary/5 border-primary/20 text-primary"
          }`}
        >
          {showBooked ? <Eye size={16} /> : <EyeSlash size={16} />}
          {showBooked ? "Все слоты" : "Только свободные"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Всего</p>
            <p className="text-2xl font-black text-slate-900">{slots.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Свободно</p>
            <p className="text-2xl font-black text-emerald-600">{slots.filter((s) => !s.is_booked).length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-bold text-red-400 uppercase mb-1">Занято</p>
            <p className="text-2xl font-black text-red-500">{slots.filter((s) => s.is_booked).length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Дат</p>
            <p className="text-2xl font-black text-slate-900">{Object.keys(groupedSlots).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Slots List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold">Загрузка...</div>
      ) : Object.keys(groupedSlots).length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center space-y-4">
          <p className="font-bold text-slate-400 text-sm">
            {selectedDentist
              ? `У ${selectedDentist.name} пока нет слотов`
              : "Выберите врача"}
          </p>
          <Button variant="outline" onClick={() => setIsGenerating(true)}>
            Сгенерировать
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <Card key={date} className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-sm">
                  {new Date(date).toLocaleDateString("ru-RU", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {dateSlots.map((slot) => {
                    const apt = slotAppointmentMap.get(String(slot.id));
                    return (
                      <div
                        key={slot.id}
                        className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          slot.is_booked
                            ? "bg-red-50 text-red-500 border border-red-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{slot.start_time}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            slot.is_booked ? "text-red-400" : "text-emerald-500"
                          }`}>
                            {slot.is_booked ? "Занят" : "Свободен"}
                          </span>
                        </div>
                        {apt && (
                          <div className="mt-1.5 pt-1.5 border-t border-red-100 text-xs text-red-600 space-y-0.5">
                            <p className="font-bold text-red-700">{apt.patient_name || "Пациент"}</p>
                            {apt.service_name && <p className="opacity-70">{apt.service_name}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Generate Slots Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Генерация слотов</h3>
              <button onClick={() => setIsGenerating(false)} className="text-slate-400 hover:text-slate-900">
                <X size={24} weight="bold" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Врач</label>
                <select
                  value={selectedDentistId}
                  onChange={(e) => setSelectedDentistId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {clinic.dentists.map((d) => (
                    <option key={d.id} value={String(d.id)}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Дата</label>
                <Input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
              </div>
              <p className="text-xs text-slate-400">
                Будут созданы 8 слотов: 09:00–12:30 и 14:00–17:30 (интервал 1 час).
              </p>
              <Button className="w-full font-bold gap-2" onClick={handleGenerate}>
                <CalendarPlus size={18} />
                Сгенерировать
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
