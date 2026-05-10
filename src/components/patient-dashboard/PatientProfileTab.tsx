import { useState } from "react";
import { IdentificationCard, CheckCircle } from "@phosphor-icons/react";
import { AuthUser, usersApi } from "../../services/api";
import { Button, Card, CardContent, Input } from "../ui";

interface PatientProfileTabProps {
  user: AuthUser | null;
  historyCount: number;
}

export default function PatientProfileTab({ user, historyCount }: PatientProfileTabProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    birthDate: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await usersApi.updateProfile({
        name: formData.name,
        phone: formData.phone,
        birthDate: formData.birthDate || undefined,
      });
      showSuccess("Профиль успешно сохранён!");
    } catch (e) {
      console.error(e);
      showError("Ошибка при сохранении профиля");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Пароли не совпадают");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (!passwordData.currentPassword) {
      showError("Введите текущий пароль");
      return;
    }
    try {
      await usersApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showSuccess("Пароль успешно обновлён!");
    } catch (e: any) {
      if (e?.code === "auth/wrong-password" || e?.code === "auth/invalid-credential") {
        showError("Неверный текущий пароль");
      } else {
        showError("Ошибка при смене пароля");
      }
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-50 border border-emerald-200 text-emerald-600 px-5 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} weight="fill" />
          {successMsg}
        </div>
      )}
      {/* Error Toast */}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Основная информация</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Имя и Фамилия</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Дата рождения</label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="bg-slate-50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Телефон</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                  <Input type="email" value={user?.email || ""} disabled className="bg-slate-100 font-medium text-slate-400 cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  className="font-bold px-8 shadow-lg shadow-primary/20"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Безопасность</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Текущий пароль</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="bg-slate-50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Новый пароль</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Подтвердите пароль</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="bg-slate-50"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="outline" className="font-bold" onClick={handleChangePassword}>
                  Обновить пароль
                </Button>
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
                <p className="font-bold text-slate-900 text-lg">{user?.name || "Пользователь"}</p>
                <p className="text-sm text-slate-500 tracking-tight">Пациент платформы</p>
              </div>
              <div className="w-full h-px bg-slate-200 my-2" />
              <div className="w-full text-left text-sm space-y-2">
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
