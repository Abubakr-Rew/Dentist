import { useState, useMemo } from "react";
import { 
  CalendarCheck, 
  IdentificationCard, 
  BriefcaseMetal, 
  Tooth,
  Hourglass,
  Phone,
  CaretDown,
  SealCheck,
  Prohibit,
  DotsThreeVertical,
  MagnifyingGlass,
  Sliders,
  ListChecks,
} from "@phosphor-icons/react";
import { mockAppointments, mockClinics, Appointment, AppointmentStatus } from "../mocks/data";
import { Button, Card, CardContent, Input } from "../components/ui";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string; dot: string }> = {
  upcoming: { label: "Ожидается", color: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-400" },
  completed: { label: "Завершен", color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-400" },
  cancelled: { label: "Отменен", color: "text-red-700", bg: "bg-red-50", dot: "bg-red-400" },
};

export default function ClinicDashboard() {
  const clinic = mockClinics[0]; // Smile Clinic
  const [selectedDate, setSelectedDate] = useState("2026-03-27");
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter(a => a.clinicId === clinic.id)
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(a => a.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate]);

  const stats = useMemo(() => {
    return {
      total: filteredAppointments.length,
      pending: filteredAppointments.filter(a => a.status === "upcoming").length,
      completed: filteredAppointments.filter(a => a.status === "completed").length,
    };
  }, [filteredAppointments]);

  const toggleStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => 
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
    setOpenDropdownId(null);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(prev => prev === id ? null : id);
  };

  const getDentist = (dentistId: string) => 
    clinic.dentists.find(d => d.id === dentistId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* Sidebar */}
      <aside className="lg:w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Tooth size={20} weight="duotone" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Админ-панель</p>
              <p className="text-sm font-black text-slate-900 leading-tight">Smile Clinic</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary/5 text-primary border border-primary/10 transition-all">
            <CalendarCheck size={18} />
            Расписание
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all opacity-60">
            <BriefcaseMetal size={18} />
            Врачи
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all opacity-60">
            <IdentificationCard size={18} />
            Пациенты
          </button>
          <div className="h-px bg-slate-100 my-4 mx-2" />
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all opacity-60">
            <Sliders size={18} />
            Настройки
          </button>
        </nav>

        <div className="p-6">
          <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
            <p className="text-xs font-medium opacity-60">Текущий тариф</p>
            <p className="text-sm font-bold uppercase tracking-wider">Premium Plan</p>
            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-xs py-2 h-auto font-bold uppercase">
              Управление
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto max-h-screen">
        
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
                onChange={(e) => setSelectedDate(e.target.value)}
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
                    const service = dentist?.services.find(s => s.id === apt.serviceId);
                    const config = STATUS_CONFIG[apt.status];
                    const isCompleted = apt.status === "completed";

                    return (
                      <tr key={apt.id} className={`group hover:bg-slate-50/50 transition-all ${isCompleted ? 'opacity-70' : ''}`}>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-none mb-1">{apt.startTime}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{apt.endTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold text-slate-900 leading-none mb-1 ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>
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
                            <span className="text-sm font-bold text-slate-700">{dentist?.name.split(' ').pop()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <span className="text-sm font-medium text-slate-600 truncate max-w-[150px] block">{service?.name}</span>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className={`relative inline-block ${openDropdownId === apt.id ? 'z-50' : 'hover:z-20'}`}>
                            <button 
                              onClick={() => toggleDropdown(apt.id)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${config.bg} ${config.color} border-current/10 cursor-pointer hover:bg-white active:scale-95 relative z-10`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {config.label}
                              <CaretDown size={14} weight="bold" className={`transition-transform duration-200 ${openDropdownId === apt.id ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {openDropdownId === apt.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40 bg-transparent" 
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                  <div className="p-1.5 space-y-1">
                                    <button onClick={() => toggleStatus(apt.id, "upcoming")} className="w-full text-left px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-2">
                                      <Hourglass size={14} weight="bold" /> Ожидается
                                    </button>
                                    <button onClick={() => toggleStatus(apt.id, "completed")} className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2">
                                      <SealCheck size={14} weight="bold" /> Завершено
                                    </button>
                                    <button onClick={() => toggleStatus(apt.id, "cancelled")} className="w-full text-left px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                      <Prohibit size={14} weight="bold" /> Отменен
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
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
                const service = dentist?.services.find(s => s.id === apt.serviceId);
                const config = STATUS_CONFIG[apt.status];
                const isCompleted = apt.status === "completed";

                return (
                  <div key={apt.id} className={`p-6 space-y-4 ${isCompleted ? 'opacity-70 bg-slate-50/30' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-slate-900 leading-none">{apt.startTime}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1">{apt.endTime}</span>
                        </div>
                        <div className="space-y-1">
                          <p className={`font-black text-slate-900 leading-none ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>
                            {apt.patientName}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{service?.name}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(apt.id)}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${config.bg} ${config.color} border-current/10 active:scale-95`}
                        >
                          <div className={`w-1 h-1 rounded-full ${config.dot}`} />
                          {config.label}
                          <CaretDown size={14} weight="bold" className={`transition-transform duration-200 ${openDropdownId === apt.id ? 'rotate-180' : ''}`} />
                        </button>

                        {openDropdownId === apt.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="p-2 space-y-1">
                                <button onClick={() => toggleStatus(apt.id, "upcoming")} className="w-full text-left px-4 py-3 text-sm font-bold text-amber-700 hover:bg-amber-50 rounded-xl flex items-center gap-3">
                                  <Hourglass size={18} weight="bold" /> Ожидается
                                </button>
                                <button onClick={() => toggleStatus(apt.id, "completed")} className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl flex items-center gap-3">
                                  <SealCheck size={18} weight="bold" /> Завершено
                                </button>
                                <button onClick={() => toggleStatus(apt.id, "cancelled")} className="w-full text-left px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 rounded-xl flex items-center gap-3">
                                  <Prohibit size={18} weight="bold" /> Отменен
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-500">
                        <img src={dentist?.photo} className="w-6 h-6 rounded-full grayscale-50" />
                        <span className="text-xs font-bold">{dentist?.name.split(' ').pop()}</span>
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
      </main>
    </div>
  );
}
