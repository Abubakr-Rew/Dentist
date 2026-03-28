import { CircleNotch } from "@phosphor-icons/react";

export function LoadingSpinner({ size = 32, className = "" }: { size?: number, className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <CircleNotch size={size} weight="bold" className="text-primary animate-spin" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={48} />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Загрузка...</p>
    </div>
  );
}
