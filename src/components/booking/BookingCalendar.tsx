import { useState, useMemo } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Clock, Calendar as CalendarIcon } from "@phosphor-icons/react";
import { TimeSlot } from "../../mocks/data";
import { Button } from "../ui";

interface BookingCalendarProps {
  timeSlots: TimeSlot[];
  onContinue: (slot: TimeSlot) => void;
}

export default function BookingCalendar({ timeSlots, onContinue }: BookingCalendarProps) {
  // Extract unique valid dates from the slots and sort them
  const availableDates = useMemo(() => {
    const uniqueDates = Array.from(new Set(timeSlots.map((slot) => slot.date)));
    return uniqueDates
      .map((dateStr) => parseISO(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [timeSlots]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(availableDates[0] || null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Filter slots for the selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return timeSlots.filter((slot) => {
      const slotDate = parseISO(slot.date);
      return isSameDay(slotDate, selectedDate);
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timeSlots, selectedDate]);

  const handleContinue = () => {
    const slot = timeSlots.find((s) => s.id === selectedSlotId);
    if (slot) {
      onContinue(slot);
    }
  };

  if (availableDates.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
        <CalendarIcon size={40} weight="bold" className="text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">К сожалению, нет доступных дат для записи.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selection Section (Horizontal Scroll on Mobile) */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CalendarIcon size={20} weight="bold" className="text-primary" />
          Выберите дату
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {availableDates.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const dayOfWeek = format(date, "EEEEEE", { locale: ru }).toUpperCase();
            const dayOfMonth = format(date, "d", { locale: ru });
            const month = format(date, "MMM", { locale: ru }).replace('.', '');

            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlotId(null); // reset selected slot when changing date
                }}
                className={`snap-start shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl border transition-all min-w-[80px] ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                <span className={`text-xs font-semibold mb-1 ${isSelected ? "text-primary-100" : "text-slate-400"}`}>
                  {dayOfWeek}
                </span>
                <span className="text-2xl font-bold leading-none mb-1">{dayOfMonth}</span>
                <span className={`text-xs font-medium ${isSelected ? "text-primary-100" : "text-slate-500"}`}>
                  {month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Section */}
      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={20} weight="bold" className="text-primary" />
            Доступное время
          </h3>
          
          {slotsForSelectedDate.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {slotsForSelectedDate.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                
                if (slot.isBooked) {
                  return (
                    <div
                      key={slot.id}
                      className="py-3 px-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-center text-sm font-medium cursor-not-allowed opacity-60 line-through"
                      title="Время занято"
                    >
                      {slot.startTime}
                    </div>
                  );
                }

                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`py-3 px-2 rounded-xl border font-medium text-sm transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {slot.startTime}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-500 text-sm">На выбранную дату нет свободного времени.</p>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="pt-6 mt-6 border-t border-slate-100">
        <Button
          onClick={handleContinue}
          disabled={!selectedSlotId}
          className="w-full sm:w-auto sm:px-12 py-6 text-lg transition-all"
        >
          {selectedSlotId ? "Продолжить" : "Выберите время"}
        </Button>
      </div>
    </div>
  );
}
