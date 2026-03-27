import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Loader } from "lucide-react";
import { Button, Card, CardContent } from "../components/ui";
import { appointmentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUS_LABELS = {
  upcoming: { label: "Предстоящая", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Завершена", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Отменена", className: "bg-red-100 text-red-600" },
};

function formatPrice(p) {
  return new Intl.NumberFormat("ru-KZ").format(p) + " ₸";
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ru-KZ", { day: "numeric", month: "long", year: "numeric" });
}

export default function ClinicDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    appointmentsApi.clinicAppointments()
      .then(setAppointments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleStatus(id, status) {
    setUpdatingId(id);
    try {
      await appointmentsApi.updateStatus(id, status);
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = appointments.filter((a) => a.status === tab);

  const stats = {
    upcoming: appointments.filter((a) => a.status === "upcoming").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    revenue: appointments.filter((a) => a.status === "completed").reduce((sum, a) => sum + (a.price || 0), 0),
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Панель клиники</h1>
        <p className="text-slate-500 mt-1">Добро пожаловать, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Предстоящих</p>
            <p className="text-3xl font-bold text-primary mt-1">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Завершено</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Выручка (завершённые)</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatPrice(stats.revenue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { key: "upcoming", label: "Предстоящие" },
          { key: "completed", label: "Завершённые" },
          { key: "cancelled", label: "Отменённые" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
            {appointments.filter((a) => a.status === key).length > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                tab === key ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {appointments.filter((a) => a.status === key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900">Нет записей</h3>
          <p className="text-slate-500 text-sm mt-1">Записи пациентов появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => {
            const status = STATUS_LABELS[appt.status];
            const isUpdating = updatingId === appt.id;
            return (
              <Card key={appt.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{appt.service_name}</span>
                        {appt.price && (
                          <span className="text-sm font-semibold text-primary">{formatPrice(appt.price)}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          {appt.patient_name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          {appt.patient_phone}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          Врач: {appt.dentist_name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          {appt.start_time} — {appt.end_time}
                        </span>
                      </div>
                    </div>

                    {appt.status === "upcoming" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatus(appt.id, "completed")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          {isUpdating ? <Loader className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Завершить
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatus(appt.id, "cancelled")}
                          disabled={isUpdating}
                          className="flex items-center gap-1"
                        >
                          {isUpdating ? <Loader className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                          Отменить
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
