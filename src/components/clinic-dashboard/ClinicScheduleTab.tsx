import { useMemo } from "react";
import {
  CalendarCheck,
  Hourglass,
  Phone,
  SealCheck,
  DotsThreeVertical,
  MagnifyingGlass,
  Sliders,
  ListChecks,
} from "@phosphor-icons/react";
import { Appointment, AppointmentStatus, Dentist } from "../../mocks/data";
import { Button, Card, CardContent, Input } from "../ui";
import StatusDropdown from "./StatusDropdown";

interface ClinicScheduleTabProps {
  appointments: Appointment[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onStatusChange: (id: string, newStatus: AppointmentStatus) => void;
  getDentist: (dentistId: string) => Dentist | undefined;
}

export default function ClinicScheduleTab({
  appointments,
  selectedDate,
  onDateChange,
  onStatusChange,
  getDentist,
}: ClinicScheduleTabProps) {
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate]);

  const stats = useMemo(() => {
    return {
      total: filteredAppointments.length,
      pending: filteredAppointments.filter((a) => a.status === "upcoming").length,
      completed: filteredAppointments.filter((a) => a.status === "completed").length,
    };
  }, [filteredAppointments]);

  return (
    <>
      {/* Header bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ежедневное расписание</h1>
          <p className="text-sm text-slate-500 font-medium">Управление записями и статусами приемов</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2 font-bold px-4 border-slate-200">
            <Sliders size={16} />
            Фильтры
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListChecks size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Всего сегодня</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hourglass size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Ожидают</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SealCheck size={24} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Завершено</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule */}
      <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm pb-24">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Записи на сегодня</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Поиск пациента..." className="pl-9 bg-slate-50 border-transparent focus:bg-white w-full sm:w-64 text-sm" />
            </div>
            <Button variant="outline" size="sm" className="px-3 border-slate-200">
              <DotsThreeVertical size={16} weight="bold" />
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-visible pb-24">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">Время</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">Пациент</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">Врач</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">Услуга</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">Статус</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => {
                  const dentist = getDentist(apt.dentistId);
                  const service = dentist?.services.find((s) => s.id === apt.serviceId);
                  const isCompleted = apt.status === "completed";

                  return (
                    <tr key={apt.id} className={`group hover:bg-slate-50/50 transition-all ${isCompleted ? "opacity-70" : ""}`}>
                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 leading-none mb-1">{apt.startTime}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{apt.endTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold text-slate-900 leading-none mb-1 ${isCompleted ? "line-through decoration-slate-400" : ""}`}>
                            {apt.patientName}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Phone size={10} />
                            {apt.patientPhone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-2">
                          <img src={dentist?.photo} alt={dentist?.name} className="w-8 h-8 rounded-full border border-slate-200 grayscale-50 group-hover:grayscale-0 transition-all" />
                          <span className="text-sm font-bold text-slate-700">{dentist?.name.split(" ").pop()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <span className="text-sm font-medium text-slate-600 truncate max-w-[150px] block">{service?.name}</span>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <StatusDropdown
                          status={apt.status}
                          onStatusChange={(newStatus) => onStatusChange(apt.id, newStatus)}
                        />
                      </td>
                      <td className="px-6 py-5 align-top text-right">
                        <button className="text-slate-300 hover:text-slate-900 transition-colors">
                          <DotsThreeVertical size={18} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="space-y-3">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300">
                        <CalendarCheck size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">На эту дату записей нет</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => {
              const dentist = getDentist(apt.dentistId);
              const service = dentist?.services.find((s) => s.id === apt.serviceId);
              const isCompleted = apt.status === "completed";

              return (
                <div key={apt.id} className={`p-6 space-y-4 ${isCompleted ? "opacity-70 bg-slate-50/30" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-slate-900 leading-none">{apt.startTime}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1">{apt.endTime}</span>
                      </div>
                      <div className="space-y-1">
                        <p className={`font-black text-slate-900 leading-none ${isCompleted ? "line-through decoration-slate-400" : ""}`}>
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{service?.name}</p>
                      </div>
                    </div>
                    <StatusDropdown
                      status={apt.status}
                      onStatusChange={(newStatus) => onStatusChange(apt.id, newStatus)}
                      mobile
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-500">
                      <img src={dentist?.photo} alt={dentist?.name} className="w-6 h-6 rounded-full grayscale-50" />
                      <span className="text-xs font-bold">{dentist?.name.split(" ").pop()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400">
                        <Phone size={16} weight="bold" />
                      </button>
                      <button className="p-2 text-slate-400">
                        <DotsThreeVertical size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Записей нет
            </div>
          )}
        </div>
      </section>
    </>
  );
}
