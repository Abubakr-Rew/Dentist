import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MagnifyingGlass, Star, Sliders, X, MapPin } from "@phosphor-icons/react";
import { Button, Input, Card, CardContent } from "../components/ui";

import { mockClinics, Clinic } from "../mocks/data";

type ClinicSummary = Clinic & { dentist_count: number };

const SERVICE_FILTERS = [
  { id: "Консультация", label: "Первичная консультация" },
  { id: "Кариес", label: "Лечение кариеса" },
  { id: "Брекеты", label: "Брекеты и элайнеры" },
  { id: "Отбеливание", label: "Отбеливание зубов" },
  { id: "Имплантация", label: "Имплантация" },
  { id: "Удаление", label: "Удаление зуба" },
];

const CITIES = ["Алматы", "Астана", "Шымкент"];

export default function Clinics() {
  const [searchParams] = useSearchParams();
  const [clinics, setClinics] = useState<ClinicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params passed from Home.tsx
  const initialSearch = searchParams.get("search") || "";
  const initialCity = searchParams.get("city") || "";

  // If the search param exactly matches a predefined service, we treat it as a service filter.
  // Otherwise, we treat it as a text search for the clinic name.
  const isServiceMatch = SERVICE_FILTERS.some(s => s.id === initialSearch) || 
                         initialSearch === "Чистка зубов"; // for Quick tags

  const resolvedInitialService = initialSearch === "Чистка зубов" ? "Отбеливание" : initialSearch; 

  const [nameQuery, setNameQuery] = useState(isServiceMatch ? "" : initialSearch);
  const [cityQuery, setCityQuery] = useState(initialCity);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    isServiceMatch ? [resolvedInitialService] : []
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mapped = mockClinics.map(c => ({
        ...c,
        dentist_count: c.dentists?.length || 0,
      }));
      setClinics(mapped as any);
      setLoading(false);
    }, 500);
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const clearFilters = () => {
    setNameQuery("");
    setCityQuery("");
    setSelectedServices([]);
  };

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      // 1. Name query filter
      if (nameQuery && !clinic.name.toLowerCase().includes(nameQuery.toLowerCase())) {
        return false;
      }
      
      // 2. City query filter
      if (cityQuery && clinic.city !== cityQuery) {
        return false;
      }
      
      // 3. Service query filter (must offer all selected services)
      if (selectedServices.length > 0) {
        const offersAllSelected = selectedServices.every(serviceId => {
           // We map serviceId back to a simple search term
           const term = serviceId === "Консультация" ? "консультация" 
                      : serviceId === "Кариес" ? "кариес"
                      : serviceId === "Брекеты" ? "брекет"
                      : serviceId === "Отбеливание" ? "отбеливани"
                      : serviceId === "Имплантация" ? "имплант"
                      : serviceId === "Удаление" ? "удален"
                      : serviceId.toLowerCase();

           return clinic.dentists?.some(d => 
             d.services.some(s => s.name.toLowerCase().includes(term))
           );
        });
        if (!offersAllSelected) return false;
      }

      return true;
    });
  }, [clinics, nameQuery, cityQuery, selectedServices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Каталог клиник</h1>
          <p className="text-slate-500 mt-1">
            Найдено клиник: <span className="font-semibold text-slate-900">{filteredClinics.length}</span>
          </p>
        </div>
        <Button
          variant="outline"
          className="lg:hidden w-full sm:w-auto flex items-center gap-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Sliders size={18} weight="bold" />
          Фильтры
          {(selectedServices.length > 0 || cityQuery) && (
            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {selectedServices.length + (cityQuery ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className={`w-full lg:w-72 shrink-0 space-y-6 ${showMobileFilters ? "block" : "hidden lg:block"} bg-white p-5 rounded-2xl border border-slate-100 shadow-sm sticky top-24`}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="font-semibold text-lg">Фильтры</h2>
            <button onClick={() => setShowMobileFilters(false)}>
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Название клиники</label>
              <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Искать по названию"
                  className="pl-9 bg-slate-50 border-slate-100 rounded-xl"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Город</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">Все города</option>
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Тип услуги</label>
              <div className="space-y-3">
                {SERVICE_FILTERS.map((s) => (
                  <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      selectedServices.includes(s.id) ? "bg-primary border-primary shadow-sm shadow-primary/20" : "border-slate-300 group-hover:border-primary"
                    }`}>
                      {selectedServices.includes(s.id) && <span className="text-white text-xs text-center leading-none">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} />
                    <span className={`text-sm ${selectedServices.includes(s.id) ? "text-slate-900 font-medium" : "text-slate-600"}`}>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(nameQuery || cityQuery || selectedServices.length > 0) && (
              <div className="pt-2">
                <Button variant="secondary" className="w-full text-xs rounded-xl" size="sm" onClick={clearFilters}>
                  Сбросить все фильтры
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
              {filteredClinics.map((clinic) => (
                <Card key={clinic.id} noPadding className="flex flex-col overflow-hidden hover:border-primary/40 transition-colors rounded-2xl">
                  <div className="aspect-[16/9] sm:aspect-[4/3] w-full bg-slate-100 relative">
                    <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                      <Star size={16} weight="fill" className="text-amber-400" />
                      <span className="text-sm font-bold text-slate-800">{clinic.rating}</span>
                    </div>
                  </div>

                  <CardContent className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{clinic.name}</h3>
                      <div className="flex items-start text-slate-500 text-sm gap-1.5">
                        <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                        <span>{clinic.city}, {clinic.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-between mt-auto">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                        Врачей: <span className="text-slate-900">{clinic.dentist_count}</span>
                      </p>
                      <Link to={`/clinics/${clinic.id}`}>
                        <Button size="sm" className="rounded-xl px-4">Записаться</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-3xl mt-4">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <MagnifyingGlass size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Ничего не найдено</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Мы не смогли найти клиники по вашему запросу. Попробуйте сбросить фильтры или выбрать другие услуги.</p>
              <Button variant="outline" className="mt-8 rounded-xl px-6" onClick={clearFilters}>
                Очистить фильтры
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
