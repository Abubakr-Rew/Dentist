import { IdentificationCard } from "@phosphor-icons/react";
import { AuthUser } from "../../services/api";
import { Button, Card, CardContent, Input } from "../ui";

interface PatientProfileTabProps {
  user: AuthUser | null;
  historyCount: number;
}

export default function PatientProfileTab({ user, historyCount }: PatientProfileTabProps) {
  return (
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
                  <span className="font-bold text-slate-700">{historyCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
