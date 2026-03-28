import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, House, ArrowRight, Download, ShareNetwork } from "@phosphor-icons/react";
import { Button } from "../components/ui";
import { mockClinics } from "../mocks/data";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  // In a real app, if data is missing, we might fetch it or show an error
  if (!bookingData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 pt-20 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-900">Данные не найдены</h2>
        <p className="text-slate-500">Пожалуйста, запишитесь через поиск клиник.</p>
        <Button onClick={() => navigate("/clinics")}>К поиску клиник</Button>
      </div>
    );
  }

  const { clinicId, dentistId, slot, serviceId } = bookingData;
  const clinic = mockClinics.find(c => c.id === clinicId);
  const dentist = clinic?.dentists.find(d => d.id === dentistId);
  const service = dentist?.services.find(s => s.id === serviceId);

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Success Status */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 animate-bounce duration-[2000ms]">
          <CheckCircle size={48} weight="fill" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Запись успешно подтверждена!
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Мы отправили детали записи на ваш номер телефона и сохранили их в личном кабинете.
          </p>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-slate-900 p-6 text-white text-center space-y-1">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Электронный талон</p>
          <p className="text-lg font-bold">{clinic?.name || "Dentist Clinic"}</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Врач</p>
              <p className="text-sm font-bold text-slate-900">{dentist?.name}</p>
              <p className="text-[11px] text-slate-500">{dentist?.specialization}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Дата и время</p>
              <p className="text-sm font-bold text-slate-900">{slot?.date}</p>
              <p className="text-sm font-medium text-emerald-600">в {slot?.startTime}</p>
            </div>
          </div>

          {/* Divider with "cutout" effect */}
          <div className="relative flex items-center justify-between py-2">
            <div className="absolute -left-10 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner" />
            <div className="w-full border-t border-dashed border-slate-200" />
            <div className="absolute -right-10 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner" />
          </div>

          {/* Service Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Услуга:</span>
              <span className="font-bold text-slate-900">{service?.name}</span>
            </div>
            
            {/* Total */}
            <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Итого:</span>
              <span className="text-xl font-black text-slate-900">
                {service?.price.toLocaleString("ru-RU")} ₸
              </span>
            </div>
          </div>

          {/* Verification Code or Stub */}
          <div className="pt-4 text-center">
            <div className="inline-block border border-slate-200 px-6 py-2 rounded-lg bg-white shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Код подтверждения</p>
              <p className="text-xl font-mono tracking-[0.2em] font-black text-slate-900">DT-4492</p>
            </div>
          </div>
        </div>

        {/* Action icons stub */}
        <div className="bg-slate-50 p-4 flex justify-around border-t border-slate-100">
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors cursor-pointer">
            <Download size={20} />
            <span className="text-[9px] font-bold uppercase">Скачать</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors cursor-pointer">
            <ShareNetwork size={20} />
            <span className="text-[9px] font-bold uppercase">Поделиться</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors cursor-pointer">
            <Calendar size={20} />
            <span className="text-[9px] font-bold uppercase">Календарь</span>
          </button>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-4 pt-4">
        <Button 
          className="w-full py-7 text-lg font-bold group shadow-lg shadow-primary/20"
          onClick={() => navigate("/patient/dashboard")}
        >
          <span className="flex items-center justify-center gap-2">
            Перейти в личный кабинет
            <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
        <div className="text-center">
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1">
            <House size={18} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
