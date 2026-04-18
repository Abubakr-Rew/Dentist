import { useState, useRef, useEffect } from "react";
import { CaretDown, Hourglass, SealCheck, Prohibit } from "@phosphor-icons/react";
import { AppointmentStatus } from "../../mocks/data";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string; dot: string }> = {
  upcoming: { label: "Ожидается", color: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-400" },
  completed: { label: "Завершен", color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-400" },
  cancelled: { label: "Отменен", color: "text-red-700", bg: "bg-red-50", dot: "bg-red-400" },
};

interface StatusDropdownProps {
  status: AppointmentStatus;
  onStatusChange: (newStatus: AppointmentStatus) => void;
  /** Use larger sizing for mobile cards */
  mobile?: boolean;
}

export default function StatusDropdown({ status, onStatusChange, mobile = false }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside (ref-based, no setTimeout)
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const config = STATUS_CONFIG[status];

  const handleSelect = (newStatus: AppointmentStatus) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  const buttonSizeClasses = mobile
    ? "px-3 py-1.5 text-[10px] gap-1.5"
    : "px-3 py-1 text-[10px] gap-2";

  const menuSizeClasses = mobile
    ? "w-48 rounded-2xl p-2"
    : "w-48 rounded-xl p-1.5";

  const itemSizeClasses = mobile
    ? "px-4 py-3 text-sm gap-3 rounded-xl"
    : "px-3 py-2 text-xs gap-2 rounded-lg";

  return (
    <div ref={containerRef} className={`relative inline-block ${isOpen ? "z-50" : "hover:z-20"}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center rounded-full font-black uppercase tracking-widest border transition-all ${config.bg} ${config.color} border-current/10 cursor-pointer hover:bg-white active:scale-95 ${buttonSizeClasses}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
        <CaretDown
          size={14}
          weight="bold"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute right-0 top-full mt-2 bg-white border border-slate-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 ${menuSizeClasses}`}
        >
          <div className="space-y-1">
            <button
              role="option"
              aria-selected={status === "upcoming"}
              onClick={() => handleSelect("upcoming")}
              className={`w-full text-left font-bold text-amber-700 hover:bg-amber-50 flex items-center ${itemSizeClasses}`}
            >
              <Hourglass size={mobile ? 18 : 14} weight="bold" /> Ожидается
            </button>
            <button
              role="option"
              aria-selected={status === "completed"}
              onClick={() => handleSelect("completed")}
              className={`w-full text-left font-bold text-emerald-700 hover:bg-emerald-50 flex items-center ${itemSizeClasses}`}
            >
              <SealCheck size={mobile ? 18 : 14} weight="bold" /> Завершено
            </button>
            <button
              role="option"
              aria-selected={status === "cancelled"}
              onClick={() => handleSelect("cancelled")}
              className={`w-full text-left font-bold text-red-700 hover:bg-red-50 flex items-center ${itemSizeClasses}`}
            >
              <Prohibit size={mobile ? 18 : 14} weight="bold" /> Отменен
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { STATUS_CONFIG };
