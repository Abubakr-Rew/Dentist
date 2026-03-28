import { Link } from 'react-router-dom';
import { House, Tooth, WarningCircle } from "@phosphor-icons/react";
import { Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary transform -rotate-12 border border-slate-100">
            <Tooth size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg border-4 border-slate-50">
            <WarningCircle size={20} weight="bold" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-slate-800">Ой, страница не найдена</h2>
          <p className="text-slate-500 font-medium">
            Похоже, этот зубной маршрут еще не проложен или страница была перемещена в архив.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/">
            <Button size="lg" className="px-8 font-bold rounded-2xl gap-3 shadow-xl shadow-primary/20">
              <House size={20} weight="bold" />
              Вернуться на главную
            </Button>
          </Link>
        </div>

        <div className="pt-8 flex items-center justify-center gap-6 opacity-30">
          <div className="h-px flex-1 bg-slate-300" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dentist Support</p>
          <div className="h-px flex-1 bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
