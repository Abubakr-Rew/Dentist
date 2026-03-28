import { useState, ChangeEvent, useMemo } from "react";
import { User, MapPin, Clock, Phone, CircleNotch, CreditCard, Sparkle, Check, CaretLeft } from "@phosphor-icons/react";
import { Clinic, Dentist, TimeSlot } from "../../mocks/data";
import { Button, Card, CardContent, Input } from "../ui";

// Mock additional mini-services (add-ons)
const MINI_SERVICES = [
  { id: "mini-1", name: "Прицельный снимок (рентген)", price: 2500 },
  { id: "mini-2", name: "Анестезия (премиум-класс)", price: 3500 },
  { id: "mini-3", name: "Комплект для домашней гигиены", price: 1500 },
];

interface BookingSummaryProps {
  clinic: Clinic;
  dentist: Dentist;
  date: string;
  timeSlot: TimeSlot;
  initialServiceId: string | null;
  onConfirm: (data: { patientName: string; patientPhone: string; serviceId: string; addonIds: string[] }) => void;
  onBack: () => void;
}

export default function BookingSummary({
  clinic,
  dentist,
  date,
  timeSlot,
  initialServiceId,
  onConfirm,
  onBack,
}: BookingSummaryProps) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the base service selected previously
  const baseService = useMemo(() => 
    dentist.services.find((s) => s.id === initialServiceId) || dentist.services[0],
    [dentist, initialServiceId]
  );

  const selectedAddons = useMemo(() => 
    MINI_SERVICES.filter(s => selectedAddonIds.includes(s.id)),
    [selectedAddonIds]
  );

  const totalPrice = useMemo(() => {
    const addonsPrice = selectedAddons.reduce((sum, s) => sum + s.price, 0);
    return baseService.price + addonsPrice;
  }, [baseService, selectedAddons]);

  const isValid = patientName.trim().length > 1 && patientPhone.replace(/\D/g, '').length >= 10;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onConfirm({
        patientName,
        patientPhone,
        serviceId: baseService.id,
        addonIds: selectedAddonIds,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Проверка данных
        </h3>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1 group"
        >
          <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
          Назад к выбору времени
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Details & Add-ons */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm bg-slate-50/50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="font-bold text-slate-900">Выбранная услуга</h4>
                <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  ОСНОВНАЯ
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-lg text-slate-900 leading-snug">{baseService.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock size={16} weight="bold" /> ~{baseService.durationMinutes} мин
                  </p>
                </div>
                <p className="text-xl font-black text-slate-900 shrink-0">
                  {baseService.price.toLocaleString("ru-RU")} ₸
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex gap-3 items-center text-slate-600">
                  <User size={16} weight="bold" className="text-slate-400" />
                  <span className="text-sm">Врач: <strong className="text-slate-900">{dentist.name}</strong></span>
                </div>
                <div className="flex gap-3 items-center text-slate-600">
                  <MapPin size={16} weight="bold" className="text-slate-400" />
                  <span className="text-sm">Место: <strong className="text-slate-900">{clinic.name}</strong></span>
                </div>
                <div className="flex gap-3 items-center text-slate-600">
                  <Clock size={16} weight="bold" className="text-slate-400" />
                  <span className="text-sm">Дата: <strong className="text-slate-900">{date} в {timeSlot.startTime}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 ml-1">
              <Sparkle size={18} weight="fill" className="text-amber-500" />
              <label className="text-sm font-bold">Дополнительные услуги (опционально)</label>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {MINI_SERVICES.map((mini) => {
                const isSelected = selectedAddonIds.includes(mini.id);
                return (
                  <button
                    key={mini.id}
                    onClick={() => toggleAddon(mini.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isSelected ? "bg-white text-slate-900 border-white" : "bg-slate-50 border-slate-200"
                      }`}>
                        {isSelected && <Check size={14} weight="bold" />}
                      </div>
                      <span className="text-sm font-medium">{mini.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                      +{mini.price.toLocaleString("ru-RU")} ₸
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Patient Info & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              Ваши контакты
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Имя и фамилия</label>
                <Input
                  placeholder="Введите ваше имя"
                  value={patientName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPatientName(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50 h-12"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Номер телефона</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} weight="bold" />
                  </div>
                  <Input
                    placeholder="+7 700 000 00 00"
                    type="tel"
                    value={patientPhone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPatientPhone(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200 focus:ring-primary/20 bg-slate-50 h-12"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 mt-8 space-y-5">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <CreditCard size={18} weight="bold" />
                  <span className="text-sm font-medium">Итого к оплате:</span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  {totalPrice.toLocaleString("ru-RU")} ₸
                </span>
              </div>

              <Button
                className="w-full py-7 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                disabled={!isValid || isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <CircleNotch size={20} className="animate-spin" />
                    Подтверждаем...
                  </div>
                ) : (
                  "Записаться на прием"
                )}
              </Button>
              
              <p className="text-[11px] text-center text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                Нажимая кнопку, вы подтверждаете согласие с правилами клиники и политикой конфиденциальности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
