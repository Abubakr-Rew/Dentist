import { Plus } from "@phosphor-icons/react";
import { Clinic } from "../../mocks/data";
import { Button, Card, CardContent } from "../ui";

interface ClinicDoctorsTabProps {
  clinic: Clinic;
}

export default function ClinicDoctorsTab({ clinic }: ClinicDoctorsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Врачи и Услуги</h1>
          <p className="text-sm text-slate-500 font-medium">Управление персоналом и прейскурантом клиники</p>
        </div>
        <Button className="font-bold gap-2">
          <Plus size={16} weight="bold" />
          Добавить врача
        </Button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {clinic.dentists.map((dentist) => (
          <Card key={dentist.id} className="border-slate-200">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={dentist.photo} alt={dentist.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{dentist.name}</h3>
                    <p className="text-sm text-slate-500">{dentist.specialization} • Стаж {dentist.experience} лет</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="font-bold px-4">Изменить</Button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Оказываемые услуги</p>
                <ul className="space-y-2">
                  {dentist.services.map((service) => (
                    <li key={service.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {service.name} <span className="text-slate-400 text-xs">({service.durationMinutes} мин)</span>
                      </span>
                      <span className="font-bold text-slate-900">{service.price.toLocaleString()} ₸</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
