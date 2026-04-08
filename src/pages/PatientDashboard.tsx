import { useState } from "react";
import { 
  CalendarHeart, 
  MapPin as Hospital, 
  IdentificationCard, 
  Sliders, 
  SignOut as DoorOpen, 
  SealCheck, 
  Prohibit,
  Tooth,
  Calendar
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { mockAppointments, mockClinics, Appointment } from "../mocks/data";
import { Button, Card, CardContent, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter(a => a.patientName === "Алексей Иванов")
  );

  const upcomingApts = appointments.filter(a => a.status === "upcoming");
  const historyApts = appointments.filter(a => a.status !== "upcoming");

  const handleCancel = (id: string) => {
    if (window.confirm("Вы уверены, что хотите отменить запись?")) {
      setAppointments(prev => 
        prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a)
      );
    }
  };

  const getClinic = (id: string) => mockClinics.find(c => c.id === id);
  const getDentist = (clinicId: string, dentistId: string) => 
    getClinic(clinicId)?.dentists.find(d => d.id === dentistId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm">
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === "appointments" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <CalendarHeart className="w-5 h-5" />
                Мои записи
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full text-left ${
                  activeTab === "profile" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <IdentificationCard className="w-5 h-5" />
                Профиль
              </button>
              <button
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all opacity-60 cursor-not-allowed"
                disabled
              >
                <Sliders className="w-5 h-5" />
                Настройки
              </button>
              <div className="h-px bg-slate-100 my-2 mx-4" />
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all w-full text-left"
              >
                <DoorOpen className="w-5 h-5" />
                Выйти
              </button>
            </nav>
          </div>

          {/* Contact Support info card */}
          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Нужна помощь?</p>
            <p className="text-sm text-slate-600 mb-4">Наша служба поддержки работает 24/7 для вас.</p>
            <Button variant="outline" className="w-full text-xs font-bold bg-white">Связаться</Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {/* Greeting */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {activeTab === "profile" ? "Управление профилем" : `Здравствуйте, ${user?.name?.split(' ')[0] || "Алексей"}!`}
              </h1>
              <p className="text-slate-500 font-medium">
                {activeTab === "profile" 
                  ? "Ваши личные данные и настройки безопасности"
                  : (upcomingApts.length > 0 
                      ? `У вас ${upcomingApts.length} предстоящая запись` 
                      : "У вас пока нет активных записей")}
              </p>
            </div>
          </header>

          {/* Sections */}
          <div className="space-y-10">
            
            {activeTab === "appointments" && (
              <>
                {/* Upcoming Appointments */}
                <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Предстоящие записи
                </h2>
              </div>

              {upcomingApts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {upcomingApts.map((apt) => {
                    const clinic = getClinic(apt.clinicId);
                    const dentist = getDentist(apt.clinicId, apt.dentistId);
                    const service = dentist?.services.find(s => s.id === apt.serviceId);

                    return (
                      <Card key={apt.id} className="group border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all active:scale-[0.995]">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Date Badge */}
                            <div className="bg-slate-50 border-r border-slate-100 p-6 sm:w-40 flex flex-col items-center justify-center text-center space-y-1">
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {new Date(apt.date).toLocaleString('ru-RU', { month: 'short' }).replace('.', '')}
                              </span>
                              <span className="text-3xl font-black text-slate-900 leading-none">
                                {new Date(apt.date).getDate()}
                              </span>
                              <span className="text-sm font-bold text-primary">
                                {apt.startTime}
                              </span>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 p-6 space-y-4">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter">
                                    <Tooth className="w-3.5 h-3.5" />
                                    <span>{service?.name}</span>
                                  </div>
                                  <Link to={`/clinics/${apt.clinicId}`} className="text-lg font-black text-slate-900 hover:text-primary transition-colors block">
                                    {clinic?.name}
                                  </Link>
                                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                    Врач: <span className="text-slate-900 font-bold">{dentist?.name}</span>
                                  </p>
                                </div>
                                <div className="hidden sm:block">
                                  <img 
                                    src={clinic?.image} 
                                    alt={clinic?.name} 
                                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-50 gap-4">
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                                  <div className="flex items-center gap-1.5">
                                    <Hospital className="w-3.5 h-3.5" />
                                    {clinic?.address}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleCancel(apt.id)}
                                  className="text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold px-4"
                                >
                                  Отменить
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">У вас пока нет записей</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Самое время позаботиться о здоровье своих зубов. Выберите подходящую клинику и врача.
                    </p>
                  </div>
                  <Button 
                    variant="primary" 
                    className="px-8 shadow-lg shadow-primary/20"
                    onClick={() => navigate("/clinics")}
                  >
                    Найти клинику
                  </Button>
                </div>
              )}
            </section>

            {/* Visit History */}
            {historyApts.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 px-1 flex items-center gap-2">
                  История визитов
                </h2>
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {historyApts.map((apt) => {
                      const clinic = getClinic(apt.clinicId);
                      const dentist = getDentist(apt.clinicId, apt.dentistId);
                      const service = dentist?.services.find(s => s.id === apt.serviceId);
                      const isCompleted = apt.status === "completed";

                      return (
                        <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 grayscale hover:grayscale-0 transition-all duration-300 bg-white hover:bg-slate-50/50">
                          <div className="flex gap-4 items-center">
                            <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {isCompleted ? <SealCheck size={20} weight="bold" /> : <Prohibit size={20} weight="bold" />}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900 text-sm leading-tight">
                                {service?.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {clinic?.name} • {dentist?.name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0">
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">
                                {new Date(apt.date).toLocaleDateString('ru-RU')}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {apt.startTime}
                              </p>
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              isCompleted 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {isCompleted ? "Завершено" : "Отменено"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
              </>
            )}

            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                      <CardContent className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Основная информация</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Имя и Фамилия</label>
                            <Input defaultValue={user?.name || "Алексей Иванов"} className="bg-slate-50 font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Дата рождения</label>
                            <Input type="date" defaultValue="1990-05-15" className="bg-slate-50 font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Телефон</label>
                            <Input defaultValue="+7 (701) 111-22-33" className="bg-slate-50 font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                            <Input type="email" defaultValue={user?.email || "alexey@example.com"} className="bg-slate-50 font-medium" />
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <Button className="font-bold px-8 shadow-lg shadow-primary/20">Сохранить изменения</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                      <CardContent className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Безопасность</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Новый пароль</label>
                            <Input type="password" placeholder="••••••••" className="bg-slate-50" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Подтвердите пароль</label>
                            <Input type="password" placeholder="••••••••" className="bg-slate-50" />
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                          <Button variant="outline" className="font-bold">Обновить пароль</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm bg-slate-50/50">
                      <CardContent className="p-6 text-center space-y-4 flex flex-col items-center">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-3xl font-black mb-2 overflow-hidden border-4 border-white shadow-md">
                            {user?.name?.charAt(0) || "А"}
                          </div>
                          <button className="absolute bottom-2 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <IdentificationCard size={16} weight="bold" />
                          </button>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{user?.name || "Алексей Иванов"}</p>
                          <p className="text-sm text-slate-500 tracking-tight">Пациент платформы</p>
                        </div>
                        <div className="w-full h-px bg-slate-200 my-2" />
                        <div className="w-full text-left text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Аккаунт создан</span>
                            <span className="font-bold text-slate-700">12 Окт 2025</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Успешных визитов</span>
                            <span className="font-bold text-slate-700">{historyApts.filter(a => a.status === 'completed').length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
