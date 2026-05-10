import { useNavigate } from "react-router-dom";
import {
  MapPin as Hospital,
  SealCheck,
  Prohibit,
  Tooth,
  Calendar,
} from "@phosphor-icons/react";
import type { PatientAppointment } from "../../services/api";
import { Button, Card, CardContent } from "../ui";

interface PatientAppointmentsTabProps {
  appointments: PatientAppointment[];
  onCancel: (id: string) => void;
}

export default function PatientAppointmentsTab({ appointments, onCancel }: PatientAppointmentsTabProps) {
  const navigate = useNavigate();

  const upcomingApts = appointments.filter((a) => a.status === "upcoming");
  const historyApts = appointments.filter((a) => a.status !== "upcoming");

  return (
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
              return (
                <Card key={apt.id} className="group border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all active:scale-[0.995]">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Date Badge */}
                      <div className="bg-slate-50 border-r border-slate-100 p-6 sm:w-40 flex flex-col items-center justify-center text-center space-y-1">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          {new Date(apt.date).toLocaleString("ru-RU", { month: "short" }).replace(".", "")}
                        </span>
                        <span className="text-3xl font-black text-slate-900 leading-none">
                          {new Date(apt.date).getDate()}
                        </span>
                        <span className="text-sm font-bold text-primary">{apt.start_time}</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter">
                              <Tooth className="w-3.5 h-3.5" />
                              <span>{apt.service_name || "Услуга не указана"}</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 block">
                              {apt.clinic_name || "Клиника"}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                              Врач: <span className="text-slate-900 font-bold">{apt.dentist_name || "Не указан"}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-50 gap-4">
                          <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                            <div className="flex items-center gap-1.5">
                              <Hospital className="w-3.5 h-3.5" />
                              {apt.clinic_address || "Адрес скрыт"}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCancel(String(apt.id))}
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
                const isCompleted = apt.status === "completed";

                return (
                  <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 grayscale hover:grayscale-0 transition-all duration-300 bg-white hover:bg-slate-50/50">
                    <div className="flex gap-4 items-center">
                      <div className={`p-3 rounded-2xl ${isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {isCompleted ? <SealCheck size={20} weight="bold" /> : <Prohibit size={20} weight="bold" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-sm leading-tight">{apt.service_name || "Услуга не указана"}</p>
                        <p className="text-xs text-slate-500">
                          {apt.clinic_name || "Клиника"} • {apt.dentist_name || "Не указан"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {new Date(apt.date).toLocaleDateString("ru-RU")}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{apt.start_time}</p>
                      </div>
                      <div
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-red-50 text-red-600 border-red-100"
                        }`}
                      >
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
  );
}
