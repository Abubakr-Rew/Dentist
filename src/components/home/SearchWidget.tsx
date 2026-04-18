import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, MapPin, Tooth } from "@phosphor-icons/react";
import { Button } from "../ui";
import { buildCatalogSearchParams, CITIES, SERVICE_FILTERS } from "../../lib/search/catalog";

export default function SearchWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const navigate = useNavigate();
  const serviceRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const serviceListboxId = "service-options-listbox";
  const cityListboxId = "city-options-listbox";

  const filteredServices = useMemo(
    () =>
      SERVICE_FILTERS.filter(
        (service) =>
          service.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.id.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  // Click-outside handler for service dropdown (ref-based, replaces setTimeout)
  useEffect(() => {
    if (!isServiceOpen) return;
    function handleClick(e: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setIsServiceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isServiceOpen]);

  // Click-outside handler for city dropdown
  useEffect(() => {
    if (!isCityOpen) return;
    function handleClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isCityOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = buildCatalogSearchParams({
      q: selectedServiceId ? "" : searchQuery,
      city: cityQuery,
      services: selectedServiceId ? [selectedServiceId] : [],
    });
    navigate(`/clinics?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="bg-white p-2 sm:p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/50 flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto relative z-20 backdrop-blur-xl">
      {/* Service Input */}
      <div ref={serviceRef} className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-text relative group">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Tooth size={24} weight="duotone" />
        </div>
        <div className="text-left w-full flex flex-col relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Что вас беспокоит?</label>
          <input
            aria-autocomplete="list"
            aria-expanded={isServiceOpen}
            aria-controls={serviceListboxId}
            role="combobox"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedServiceId(null);
              setIsServiceOpen(true);
            }}
            onFocus={() => setIsServiceOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsServiceOpen(false);
            }}
            placeholder="Услуга или симптом"
            className="w-full bg-transparent text-slate-900 font-bold focus:outline-none placeholder:font-normal placeholder:text-slate-400 text-sm sm:text-base border-none pl-1"
          />
        </div>

        {/* Dropdown Menu for Services */}
        {isServiceOpen && (
          <div
            id={serviceListboxId}
            role="listbox"
            className="absolute top-full left-0 mt-3 w-[calc(100%+2rem)] sm:w-full -ml-4 sm:ml-0 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-64 overflow-y-auto z-50 p-2 animate-in fade-in slide-in-from-top-2"
          >
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedServiceId === service.id}
                  key={service.id}
                  onMouseDown={() => {
                    setSearchQuery(service.id);
                    setSelectedServiceId(service.id);
                    setIsServiceOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer rounded-xl font-bold text-slate-700 hover:text-primary transition-colors flex flex-col"
                >
                  <span>{service.label}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-slate-400 text-sm">Услуга не найдена. Попробуйте другой запрос.</div>
            )}
          </div>
        )}
      </div>

      <div className="hidden sm:block w-px bg-slate-100 my-4" />

      {/* City Selector */}
      <div
        ref={cityRef}
        className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer relative group"
        onClick={() => setIsCityOpen(!isCityOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsCityOpen((value) => !value);
          }
          if (e.key === "Escape") setIsCityOpen(false);
        }}
        tabIndex={0}
        role="combobox"
        aria-expanded={isCityOpen}
        aria-controls={cityListboxId}
      >
        <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0">
          <MapPin size={24} weight="duotone" />
        </div>
        <div className="text-left w-full flex flex-col pointer-events-none">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ваш город</label>
          <div className={`w-full font-bold pl-1 text-sm sm:text-base ${cityQuery ? "text-slate-900" : "text-slate-400 font-normal"}`}>
            {cityQuery || "Любой город"}
          </div>
        </div>
        <CaretDown
          size={16}
          weight="bold"
          className={`text-slate-300 absolute right-4 transition-transform duration-200 ${isCityOpen ? "rotate-180 text-primary" : "group-hover:text-primary"}`}
        />

        {/* Dropdown Menu for Cities */}
        {isCityOpen && (
          <div
            id={cityListboxId}
            role="listbox"
            className="absolute top-full left-0 mt-3 w-[calc(100%+2rem)] sm:w-full -ml-4 sm:ml-0 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2"
          >
            <button
              type="button"
              role="option"
              aria-selected={cityQuery === ""}
              onMouseDown={() => {
                setCityQuery("");
                setIsCityOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer rounded-xl font-bold transition-colors ${cityQuery === "" ? "bg-primary/5 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
            >
              Любой город
            </button>
            {CITIES.map((city) => (
              <button
                type="button"
                role="option"
                aria-selected={cityQuery === city}
                key={city}
                onMouseDown={() => {
                  setCityQuery(city);
                  setIsCityOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer rounded-xl font-bold transition-colors ${cityQuery === city ? "bg-primary/5 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto px-10 rounded-[1.5rem] shrink-0 font-bold text-lg shadow-lg shadow-primary/20">
        Поиск
      </Button>
    </form>
  );
}
