import { SealCheck } from "@phosphor-icons/react";
import { Clinic } from "../../mocks/data";
import { Button, Card, CardContent, Input } from "../ui";

interface ClinicSettingsTabProps {
  clinic: Clinic;
}

export default function ClinicSettingsTab({ clinic }: ClinicSettingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Профиль клиники</h1>
          <p className="text-sm text-slate-500 font-medium">Основная информация о вашей стоматологии</p>
        </div>
        <Button className="font-bold px-8">
          Сохранить
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Публичные данные</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Название клиники</label>
                  <Input defaultValue={clinic.name} className="bg-slate-50 font-medium" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Номер телефона</label>
                    <Input defaultValue={clinic.phone} className="bg-slate-50 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Город</label>
                    <Input defaultValue={clinic.city} className="bg-slate-50 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Точный адрес</label>
                  <Input defaultValue={clinic.address} className="bg-slate-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Описание (о клинике)</label>
                  <textarea
                    className="w-full min-h-[100px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    defaultValue={clinic.description}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video w-full relative group cursor-pointer bg-slate-100">
                <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-sm tracking-widest uppercase">Изменить фото</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Рейтинг клиники</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">{clinic.rating}</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <SealCheck key={i} weight="fill" className={i <= Math.round(clinic.rating) ? "" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
