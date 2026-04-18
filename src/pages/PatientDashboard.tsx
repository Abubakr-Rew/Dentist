import { useState } from "react";
import {
  CalendarHeart,
  IdentificationCard,
  Sliders,
  SignOut as DoorOpen,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { mockAppointments, Appointment } from "../mocks/data";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import PatientAppointmentsTab from "../components/patient-dashboard/PatientAppointmentsTab";
import PatientProfileTab from "../components/patient-dashboard/PatientProfileTab";

type TabId = "appointments" | "profile";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter((a) => a.patientName === "Алексей Иванов"),
  );

  const upcomingApts = appointments.filter((a) => a.status === "upcoming");
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  const handleCancel = (id: string) => {
    if (window.confirm("Вы уверены, что хотите отменить запись?")) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a)));
    }
  };

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
                  navigate("/login");
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
                {activeTab === "profile"
                  ? "Управление профилем"
                  : `Здравствуйте, ${user?.name?.split(" ")[0] || "Алексей"}!`}
              </h1>
              <p className="text-slate-500 font-medium">
                {activeTab === "profile"
                  ? "Ваши личные данные и настройки безопасности"
                  : upcomingApts.length > 0
                    ? `У вас ${upcomingApts.length} предстоящая запись`
                    : "У вас пока нет активных записей"}
              </p>
            </div>
          </header>

          {/* Tab Content */}
          <div className="space-y-10">
            {activeTab === "appointments" && (
              <PatientAppointmentsTab appointments={appointments} onCancel={handleCancel} />
            )}

            {activeTab === "profile" && (
              <PatientProfileTab user={user} historyCount={completedCount} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
