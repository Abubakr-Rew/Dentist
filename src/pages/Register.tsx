import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { Stethoscope, UserPlus } from "lucide-react";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

type Role = "patient" | "clinic";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  clinicName?: string;
  address?: string;
  general?: string;
}

export default function Register() {
  const [role, setRole] = useState<Role>("patient");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    clinicName: "", address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Имя обязательно";
    if (!form.email.trim()) {
      errs.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Введите корректный email";
    }
    if (!form.phone.trim()) {
      errs.phone = "Телефон обязателен";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Введите корректный номер";
    }
    if (!form.password) {
      errs.password = "Пароль обязателен";
    } else if (form.password.length < 6) {
      errs.password = "Минимум 6 символов";
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Пароли не совпадают";
    }
    if (role === "clinic") {
      if (!form.clinicName.trim()) errs.clinicName = "Название клиники обязательно";
      if (!form.address.trim()) errs.address = "Адрес обязателен";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const { token, user } = await authApi.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
        ...(role === "clinic" ? { clinicName: form.clinicName, address: form.address } : {}),
      });
      login(token, user);
      navigate(user.role === "clinic" ? "/clinic/dashboard" : "/patient/dashboard");
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Ошибка регистрации" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 py-12 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Регистрация</h1>
            <p className="text-sm text-muted-foreground">Создайте аккаунт за пару минут</p>
          </div>

          {/* role tabs */}
          <div className="flex rounded-lg bg-secondary p-1 gap-1">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                role === "patient" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">🦷 Я Пациент</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("clinic")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                role === "clinic" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Stethoscope className="w-4 h-4" /> Я Клиника
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {errors.general}
              </div>
            )}

            <Input label="Полное имя" placeholder="Иван Петров" value={form.name} onChange={set("name")} error={errors.name} />

            {role === "clinic" && (
              <>
                <Input label="Название клиники" placeholder="Smile Clinic" value={form.clinicName} onChange={set("clinicName")} error={errors.clinicName} />
                <Input label="Адрес клиники" placeholder="ул. Абая 12, Алматы" value={form.address} onChange={set("address")} error={errors.address} />
              </>
            )}

            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} />
            <Input label="Телефон" type="tel" placeholder="+7 (7XX) XXX-XX-XX" value={form.phone} onChange={set("phone")} error={errors.phone} />
            <Input
              label="Пароль" type="password" placeholder="••••••••"
              value={form.password} onChange={set("password")} error={errors.password}
              helperText={!errors.password ? "Минимум 6 символов" : undefined}
            />
            <Input label="Подтвердите пароль" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
