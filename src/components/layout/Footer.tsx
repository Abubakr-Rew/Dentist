import { Link } from "react-router-dom";
import { Tooth, Phone, EnvelopeSimple, MapPin } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tooth size={28} weight="duotone" className="text-primary" />
              <span className="font-bold text-xl text-gray-900">Dentist</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Платформа для записи к стоматологу онлайн. Проверенные клиники и реальные отзывы.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Навигация</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors font-medium">Главная</Link>
              <Link to="/clinics" className="text-sm text-gray-600 hover:text-primary transition-colors font-medium">Врачи и Клиники</Link>
              <Link to="/#how-it-works" className="text-sm text-gray-600 hover:text-primary transition-colors font-medium">Как это работает</Link>
              <Link to="/#partners" className="text-sm text-gray-600 hover:text-primary transition-colors font-medium">Партнёрам</Link>
            </nav>
          </div>

          {/* For clinics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Для клиник</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/register" className="text-sm text-gray-600 hover:text-primary transition-colors font-medium">Подключить клинику</Link>
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary transition-colors font-medium">Войти в кабинет</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Контакты</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+77000000000" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors font-medium">
                <Phone size={16} weight="bold" className="text-gray-400 shrink-0" />
                +7 (700) 000-00-00
              </a>
              <a href="mailto:hello@dentist.kz" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors font-medium">
                <EnvelopeSimple size={16} weight="bold" className="text-gray-400 shrink-0" />
                hello@dentist.kz
              </a>
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <MapPin size={16} weight="bold" className="text-gray-400 shrink-0 mt-0.5" />
                <span>Алматы, Казахстан</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Dentist Platform. Все права защищены.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Политика конфиденциальности</span>
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Условия использования</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
