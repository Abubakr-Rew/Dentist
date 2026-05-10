import { useState, useMemo } from "react";
import {
  MagnifyingGlass,
  Phone,
  CalendarCheck,
  User,
} from "@phosphor-icons/react";
import type { ClinicAppointment } from "../../services/api";
import { Card, CardContent, Input } from "../ui";

interface ClinicPatientsTabProps {
  appointments: ClinicAppointment[];
}

interface PatientInfo {
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  services: string[];
}

export default function ClinicPatientsTab({ appointments }: ClinicPatientsTabProps) {
  const [search, setSearch] = useState("");

  // Aggregate patients from all appointments
  const patients = useMemo(() => {
    const map = new Map<string, PatientInfo>();

    for (const apt of appointments) {
      const key = apt.patient_name || "Неизвестный";
      const existing = map.get(key);

      if (existing) {
        existing.visits += 1;
        if (apt.date > existing.lastVisit) existing.lastVisit = apt.date;
        if (apt.service_name && !existing.services.includes(apt.service_name)) {
          existing.services.push(apt.service_name);
        }
      } else {
        map.set(key, {
          name: key,
          phone: apt.patient_phone || "—",
          visits: 1,
          lastVisit: apt.date || "—",
          services: apt.service_name ? [apt.service_name] : [],
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
  }, [appointments]);

  const filtered = search
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.phone.includes(search)
      )
    : patients;

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Пациенты</h1>
          <p className="text-sm text-slate-500 font-medium">
            Все пациенты, записавшиеся в вашу клинику
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Всего пациентов
              </p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{patients.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Всего записей
              </p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{appointments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck size={24} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Ср. визитов
              </p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {patients.length > 0 ? (appointments.length / patients.length).toFixed(1) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Поиск по имени или телефону..."
          className="pl-9 bg-white border-slate-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300">
            <User size={32} />
          </div>
          <p className="font-bold text-slate-400 text-sm">
            {search ? "Пациентов не найдено" : "Пока нет записей от пациентов"}
          </p>
        </div>
      ) : (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
                    Пациент
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
                    Телефон
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
                    Визитов
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
                    Последний визит
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
                    Услуги
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((patient, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-black shrink-0">
                          {patient.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 flex items-center gap-1.5">
                        <Phone size={12} />
                        {patient.phone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">{patient.visits}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {patient.lastVisit !== "—"
                          ? new Date(patient.lastVisit).toLocaleDateString("ru-RU")
                          : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.services.map((s, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((patient, i) => (
              <div key={i} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{patient.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone size={10} /> {patient.phone}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-slate-900">{patient.visits}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {patient.services.map((s, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
