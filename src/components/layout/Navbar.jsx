import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Stethoscope, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
    setIsOpen(false);
  }

  const dashboardPath = user?.role === 'clinic' ? '/clinic/dashboard' : '/patient/dashboard';

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-gray-900">Dentist</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-primary hover:text-gray-700 transition-colors">Главная</Link>
              <Link to="/clinics" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-primary hover:text-gray-700 transition-colors">Поиск клиник</Link>
            </div>
          </div>

          {/* Desktop right side */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.name}
                </span>
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Кабинет
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Войти</Link>
                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors">Регистрация</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <span className="sr-only">Открыть меню</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">Главная</Link>
            <Link to="/clinics" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">Поиск клиник</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100">
            <div className="flex flex-col px-4 space-y-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-500">{user.name}</span>
                  <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="block text-base font-medium text-gray-600 hover:text-primary">Кабинет</Link>
                  <button onClick={handleLogout} className="text-left text-base font-medium text-red-500 hover:text-red-600 cursor-pointer">Выйти</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block text-base font-medium text-gray-500 hover:text-gray-800">Войти</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block text-base font-medium text-primary hover:text-primary/80">Регистрация</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
