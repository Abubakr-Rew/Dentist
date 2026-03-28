import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { BriefcaseMetal, SealCheck } from "@phosphor-icons/react";

type Role = "patient" | "clinic";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!email.trim()) {
      errs.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Введите корректный email";
    }
    if (!password) {
      errs.password = "Пароль обязателен";
    } else if (password.length < 6) {
      errs.password = "Минимум 6 символов";
    }
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      // mock — just show success
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 py-12 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      {/* decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* card */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-2xl shadow-xl p-8 space-y-6">
          {/* header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <SealCheck size={24} weight="bold" className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Вход в аккаунт</h1>
            <p className="text-sm text-muted-foreground">
              Войдите, чтобы управлять записями
            </p>
          </div>

          {/* role tabs */}
          <div className="flex rounded-lg bg-secondary p-1 gap-1">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                role === "patient"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                🦷 Я Пациент
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("clinic")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                role === "clinic"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <BriefcaseMetal size={16} weight="bold" /> Я Клиника
              </span>
            </button>
          </div>

          {/* form */}
          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <p className="font-semibold text-foreground">Успешный вход!</p>
              <p className="text-sm text-muted-foreground">
                Перенаправляем в{" "}
                {role === "patient" ? "личный кабинет" : "панель клиники"}…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Input
                label="Пароль"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <Button type="submit" className="w-full">
                Войти как {role === "patient" ? "пациент" : "клиника"}
              </Button>
            </form>
          )}

          {/* footer */}
          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
