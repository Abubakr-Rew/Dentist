import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MagnifyingGlass, Hospital, Star, Sliders, X } from "@phosphor-icons/react";
import { Button, Input, Card, CardContent } from "../components/ui";
import { clinicsApi, ClinicSummary } from "../services/api";

const SERVICE_FILTERS = [
  { id: "чистка", label: "Чистка зубов" },
  { id: "удаление", label: "Удаление зуба" },
  { id: "брекеты", label: "Установка брекетов" },
  { id: "кариес", label: "Лечение кариеса" },
  { id: "имплантация", label: "Имплантация" },
];

export default function Clinics() {
  const [searchParams] = useSearchParams();
  const [clinics, setClinics] = useState<ClinicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    clinicsApi.list()
      .then(setClinics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = clinic.name.toLowerCase().includes(q) || clinic.city.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      return true;
    });
  }, [clinics, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Поиск клиник</h1>
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
          {selectedServices.length > 0 && (
            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {selectedServices.length}
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className={`w-full lg:w-72 shrink-0 space-y-6 ${showMobileFilters ? "block" : "hidden lg:block"} bg-white p-5 rounded-xl border border-border shadow-sm`}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="font-semibold text-lg">Фильтры</h2>
            <button onClick={() => setShowMobileFilters(false)}>
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Название или город</label>
              <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Поиск..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-900 block mb-3">Тип услуги</label>
              <div className="space-y-3">
                {SERVICE_FILTERS.map((s) => (
                  <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedServices.includes(s.id) ? "bg-primary border-primary" : "border-slate-300 group-hover:border-primary"
                    }`}>
                      {selectedServices.includes(s.id) && <span className="text-white text-xs text-center leading-none">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} />
                    <span className="text-sm text-slate-700">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(searchQuery || selectedServices.length > 0) && (
              <div className="pt-4">
                <Button variant="outline" className="w-full text-xs" size="sm" onClick={() => { setSearchQuery(""); setSelectedServices([]); }}>
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClinics.map((clinic) => (
                <Card key={clinic.id} noPadding className="flex flex-col overflow-hidden hover:border-primary/40 transition-colors">
                  <div className="aspect-[4/3] bg-slate-100 relative">
                    <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={16} weight="fill" className="text-amber-400" />
                      <span className="text-sm font-semibold text-slate-800">{clinic.rating}</span>
                    </div>
                  </div>

                  <CardContent className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{clinic.name}</h3>
                      <div className="flex items-start text-slate-500 text-sm gap-1.5">
                        <Hospital size={16} className="shrink-0 mt-0.5 text-slate-400" />
                        <span>{clinic.city}, {clinic.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex-1">
                      <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">
                        Врачей: {clinic.dentist_count}
                      </p>
                    </div>

                    <Link to={`/clinics/${clinic.id}`} className="mt-auto pt-2 block">
                      <Button className="w-full">Посмотреть врачей</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlass size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ничего не найдено</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Попробуйте изменить параметры фильтрации или ввести другой запрос.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(""); setSelectedServices([]); }}>
                Очистить поиск
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
