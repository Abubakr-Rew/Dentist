import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <Tooth size={32} weight="duotone" className="text-primary group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">Dentist</span>
            </Link>
            <div className="hidden lg:ml-8 lg:flex lg:space-x-6 xl:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Главная
              </Link>
              <Link to="/clinics" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Врачи и Клиники
              </Link>
              <a href="/#how-it-works" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Как это работает
              </a>
              <a href="/#partners" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Партнерам
              </a>
              <a href="/#contacts" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all">
                Контакты
              </a>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            
            {!user ? (
              /* Вывод кнопок авторизации, если пользователь не вошел */
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
              </div>
            ) : (
              /* Возврат в Кабинет, если залогинен */
              <div className="flex items-center gap-3 pl-2">
                <Link 
                  to={user.role === 'clinic' ? "/clinic/dashboard" : "/patient/dashboard"} 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all"
                >
                  {user.role === 'clinic' ? <Layout size={18} weight="bold" /> : <User size={18} weight="bold" />}
                  Мой кабинет
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Выйти"
                >
                  <DoorOpen size={20} weight="bold" />
                </button>
              </div>
            )}
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
            <Link to="/clinics" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-600 hover:bg-gray-50 transition-colors">Врачи и Клиники</Link>
            <a href="/#how-it-works" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-600 hover:bg-gray-50 transition-colors">Как это работает</a>
            <a href="/#partners" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-600 hover:bg-gray-50 transition-colors">Партнерам</a>
            <a href="/#contacts" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-gray-600 hover:bg-gray-50 transition-colors">Контакты</a>
          </div>

          <div className="pt-4 pb-6 border-t border-gray-100 px-4 space-y-3">
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-50 rounded-xl">
                  <SignIn size={18} /> Войти
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-primary rounded-xl">
                  <UserPlus size={18} weight="bold" /> Регистрация
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to={user.role === 'clinic' ? "/clinic/dashboard" : "/patient/dashboard"} 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-primary bg-primary/10 rounded-xl"
                >
                  {user.role === 'clinic' ? <Layout size={18} weight="bold" /> : <User size={18} weight="bold" />}
                  Мой кабинет
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl"
                >
                  <DoorOpen size={18} weight="bold" /> Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
