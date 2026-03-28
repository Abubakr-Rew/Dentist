import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  List, 
  X, 
  Tooth, 
  User, 
  Layout, 
  SignIn,
  UserPlus,
  DoorOpen
} from '@phosphor-icons/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(true); // Mock auth state

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <Tooth size={32} weight="duotone" className="text-primary group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">Dentist</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Главная
              </Link>
              <Link to="/clinics" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Поиск клиник
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Dev Links (Always visible for now) */}
            <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
              <Link 
                to="/patient/dashboard" 
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <User size={18} weight="bold" />
                Пациент
              </Link>
              <Link 
                to="/clinic/dashboard" 
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-100"
              >
                <Layout size={18} weight="bold" />
                Админ
              </Link>
            </div>

            {/* Auth Links */}
            <div className="flex items-center gap-3 pl-2">
              <Link 
                to="/login" 
                className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-primary transition-colors"
              >
                <SignIn size={18} />
                Войти
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <UserPlus size={18} weight="bold" />
                Регистрация
              </Link>
              {isLoggedIn && (
                <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                  <DoorOpen size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="-mr-2 flex items-center lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none transition-colors">
              <span className="sr-only">Открыть меню</span>
              {isOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-600 hover:bg-gray-50 transition-colors">Главная</Link>
            <Link to="/clinics" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-600 hover:bg-gray-50 transition-colors">Поиск клиник</Link>
            
            <div className="h-px bg-gray-50 mx-4 my-2" />
            <Link to="/patient/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-bold text-primary hover:bg-primary/5 transition-colors">
              <User size={20} weight="bold" /> Панель пациента
            </Link>
            <Link to="/clinic/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-bold text-amber-700 hover:bg-amber-50 transition-colors">
              <Layout size={20} weight="bold" /> Админ-панель
            </Link>
          </div>

          <div className="pt-4 pb-6 border-t border-gray-100 px-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl">
                <SignIn size={18} /> Войти
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-primary rounded-xl">
                <UserPlus size={18} weight="bold" /> Регистрация
              </Link>
            </div>
            {isLoggedIn && (
              <button className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl">
                <DoorOpen size={18} weight="bold" /> Выйти
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
