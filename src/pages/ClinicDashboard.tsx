import { useState } from "react";
import {
  CalendarCheck,
  IdentificationCard,
  BriefcaseMetal,
  Tooth,
  Sliders,
  SignOut,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { mockAppointments, mockClinics, Appointment, AppointmentStatus } from "../mocks/data";
import { useAuth } from "../context/AuthContext";
import ClinicScheduleTab from "../components/clinic-dashboard/ClinicScheduleTab";
import ClinicDoctorsTab from "../components/clinic-dashboard/ClinicDoctorsTab";
import ClinicSettingsTab from "../components/clinic-dashboard/ClinicSettingsTab";

type TabId = "schedule" | "doctors" | "settings";

const SIDEBAR_TABS: { id: TabId; label: string; icon: typeof CalendarCheck }[] = [
  { id: "schedule", label: "Расписание", icon: CalendarCheck },
  { id: "doctors", label: "Врачи и Услуги", icon: BriefcaseMetal },
  { id: "settings", label: "Профиль клиники", icon: Sliders },
];

export default function ClinicDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const clinic = mockClinics[0]; // Smile Clinic
  const [activeTab, setActiveTab] = useState<TabId>("schedule");
  const [selectedDate, setSelectedDate] = useState("2026-03-27");
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter((a) => a.clinicId === clinic.id),
  );

  const toggleStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const getDentist = (dentistId: string) => clinic.dentists.find((d) => d.id === dentistId);

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
          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/5 text-primary border border-primary/10"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all opacity-60 cursor-not-allowed"
            disabled
          >
            <IdentificationCard size={18} />
            Пациенты
          </button>
        </nav>

        <div className="p-6 space-y-2">
          <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
            <p className="text-xs font-medium opacity-60">Текущий тариф</p>
            <p className="text-sm font-bold uppercase tracking-wider">Premium Plan</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <SignOut size={18} weight="bold" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto max-h-screen">
        {activeTab === "schedule" && (
          <ClinicScheduleTab
            appointments={appointments}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onStatusChange={toggleStatus}
            getDentist={getDentist}
          />
        )}

        {activeTab === "doctors" && <ClinicDoctorsTab clinic={clinic} />}

        {activeTab === "settings" && <ClinicSettingsTab clinic={clinic} />}
      </main>
    </div>
  );
}
