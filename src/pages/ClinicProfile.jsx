import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Phone, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Card, CardContent } from "../components/ui";
import { clinicsApi, dentistsApi, appointmentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatPrice(p) {
  return new Intl.NumberFormat("ru-KZ").format(p) + " ₸";
}

function getNextDays(n = 14) {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // skip Sunday
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTH_NAMES = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

// ── component ────────────────────────────────────────────────────────────────

export default function ClinicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // booking state
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [availableDays] = useState(getNextDays(14));
  const [dayOffset, setDayOffset] = useState(0); // which 5-day window to show
  const [selectedDay, setSelectedDay] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const DAYS_PER_PAGE = 5;
  const visibleDays = availableDays.slice(dayOffset, dayOffset + DAYS_PER_PAGE);

  useEffect(() => {
    clinicsApi.get(id)
      .then((data) => {
        setClinic(data);
        if (data.dentists?.length > 0) {
          setSelectedDentist(data.dentists[0]);
          setSelectedService(data.dentists[0].services?.[0] ?? null);
        }
      })
      .catch(() => setError("Не удалось загрузить данные клиники"))
      .finally(() => setLoading(false));
  }, [id]);

  // Load slots when dentist or day changes
  useEffect(() => {
    if (!selectedDentist || !selectedDay) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    dentistsApi.slots(selectedDentist.id, selectedDay)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDentist, selectedDay]);

  function handleDentistChange(dentist) {
    setSelectedDentist(dentist);
    setSelectedService(dentist.services?.[0] ?? null);
    setSelectedSlot(null);
    setBookingSuccess(false);
    setBookingError("");
  }

  async function handleBook() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedSlot || !selectedService || !selectedDentist) return;

    setBooking(true);
    setBookingError("");
    try {
      await appointmentsApi.book({
        dentist_id: selectedDentist.id,
        service_id: selectedService.id,
        time_slot_id: selectedSlot.id,
      });
      setBookingSuccess(true);
      // Mark slot as booked locally
      setSlots((prev) => prev.map((s) => s.id === selectedSlot.id ? { ...s, is_booked: true } : s));
      setSelectedSlot(null);
    } catch (err) {
      setBookingError(err.message || "Не удалось создать запись");
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-slate-100 rounded-2xl" />
        <div className="h-10 bg-slate-100 rounded w-1/2" />
        <div className="h-6 bg-slate-100 rounded w-1/3" />
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">{error || "Клиника не найдена"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/clinics")}>
          Вернуться к поиску
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors cursor-pointer">
        <ChevronLeft className="w-4 h-4" /> Назад
      </button>

      {/* Hero */}
      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-100">
        <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{clinic.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{clinic.city}, {clinic.address}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{clinic.phone}</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{clinic.rating}</span>
          </div>
        </div>
      </div>

      <p className="text-slate-600">{clinic.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: dentist selector */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Врачи</h2>
          {clinic.dentists.map((dentist) => (
            <Card
              key={dentist.id}
              className={`cursor-pointer transition-all ${selectedDentist?.id === dentist.id ? "border-primary ring-1 ring-primary" : "hover:border-slate-300"}`}
              onClick={() => handleDentistChange(dentist)}
            >
              <CardContent className="p-4 flex gap-3">
                <img src={dentist.photo} alt={dentist.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{dentist.name}</p>
                  <p className="text-xs text-primary mt-0.5">{dentist.specialization}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {dentist.experience} лет опыта
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: booking panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDentist && (
            <>
              {/* Service picker */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Выберите услугу</h3>
                <div className="space-y-2">
                  {selectedDentist.services.map((svc) => (
                    <label
                      key={svc.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedService?.id === svc.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="service"
                          className="accent-primary"
                          checked={selectedService?.id === svc.id}
                          onChange={() => setSelectedService(svc)}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{svc.name}</p>
                          <p className="text-xs text-slate-500">{svc.duration_minutes} мин</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{formatPrice(svc.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date picker */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Выберите дату</h3>
                <div className="flex items-center gap-2">
                  <button
                    disabled={dayOffset === 0}
                    onClick={() => setDayOffset((o) => Math.max(0, o - DAYS_PER_PAGE))}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2 flex-1 overflow-hidden">
                    {visibleDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 py-2 text-xs rounded-xl border transition-colors cursor-pointer ${
                          selectedDay === day
                            ? "bg-primary text-white border-primary"
                            : "border-slate-200 hover:border-primary text-slate-700"
                        }`}
                      >
                        {formatDate(day)}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={dayOffset + DAYS_PER_PAGE >= availableDays.length}
                    onClick={() => setDayOffset((o) => o + DAYS_PER_PAGE)}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Time slots */}
              {selectedDay && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Выберите время</h3>
                  {slotsLoading ? (
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-slate-500 text-sm">Нет доступных слотов на этот день</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          disabled={slot.is_booked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                            slot.is_booked
                              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                              : selectedSlot?.id === slot.id
                              ? "bg-primary text-white border-primary"
                              : "border-slate-200 hover:border-primary text-slate-700"
                          }`}
                        >
                          {slot.start_time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Confirm */}
              {bookingSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-semibold">Запись успешно создана!</p>
                  <p className="text-green-600 text-sm mt-1">Вы можете просмотреть её в личном кабинете.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/patient/dashboard")}>
                    Перейти в кабинет
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                      {bookingError}
                    </div>
                  )}
                  {selectedSlot && selectedService && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
                      <p><span className="text-slate-500">Врач:</span> <span className="font-medium">{selectedDentist.name}</span></p>
                      <p><span className="text-slate-500">Услуга:</span> <span className="font-medium">{selectedService.name}</span></p>
                      <p><span className="text-slate-500">Дата:</span> <span className="font-medium">{formatDate(selectedDay)}, {selectedSlot.start_time}</span></p>
                      <p><span className="text-slate-500">Стоимость:</span> <span className="font-semibold text-primary">{formatPrice(selectedService.price)}</span></p>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    disabled={!selectedSlot || !selectedService || booking}
                    onClick={handleBook}
                  >
                    {booking ? "Оформляем..." : user ? "Записаться" : "Войдите, чтобы записаться"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
