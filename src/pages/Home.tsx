import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hospital, Star, CaretDown, MapPin, Tooth } from "@phosphor-icons/react";
import { Button, Card, CardContent } from "../components/ui";
import { ClinicSummary } from "../services/api";

import { mockClinics } from "../mocks/data";

export default function Home() {
  const [popularClinics, setPopularClinics] = useState<ClinicSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  
  const navigate = useNavigate();

  const SERVICES_MAP = [
    { id: "Консультация", label: "Первичная консультация" },
    { id: "Кариес", label: "Лечение кариеса" },
    { id: "Брекеты", label: "Брекеты и элайнеры" },
    { id: "Отбеливание", label: "Отбеливание зубов" },
    { id: "Имплантация", label: "Имплантация" },
    { id: "Удаление", label: "Удаление зуба" },
    { id: "Чистка", label: "Профессиональная чистка зубов" },
    { id: "Виниры", label: "Установка виниров" },
  ];

  const CITIES = ["Алматы", "Астана", "Шымкент"];

  const filteredServices = SERVICES_MAP.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const mapped = mockClinics.map(c => ({
      ...c,
      dentist_count: c.dentists?.length || 0,
    }));
    setPopularClinics(mapped.slice(0, 3) as any);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (cityQuery) params.set("city", cityQuery);
    navigate(`/clinics?${params.toString()}`);
  }

  return (
    <div className="-mt-8 space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Найдите лучшего стоматолога и <span className="text-primary">запишитесь онлайн</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Сотни проверенных клиник, реальные отзывы пациентов и моментальное бронирование удобного времени.
            </p>
          </div>

          {/* Structured Booking Widget */}
          <form onSubmit={handleSearch} className="bg-white p-2 sm:p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/50 flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto relative z-20 backdrop-blur-xl">
            
            <div className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-text relative group">
               <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                 <Tooth size={24} weight="duotone" />
               </div>
               <div className="text-left w-full flex flex-col relative">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Что вас беспокоит?</label>
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setIsServiceOpen(true);
                   }}
                   onFocus={() => setIsServiceOpen(true)}
                   onBlur={() => setTimeout(() => setIsServiceOpen(false), 200)}
                   placeholder="Услуга или симптом"
                   className="w-full bg-transparent text-slate-900 font-bold focus:outline-none placeholder:font-normal placeholder:text-slate-400 text-sm sm:text-base border-none pl-1"
                 />
               </div>
               
               {/* Dropdown Menu for Services */}
               {isServiceOpen && (
                 <div className="absolute top-full left-0 mt-3 w-[calc(100%+2rem)] sm:w-full -ml-4 sm:ml-0 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-64 overflow-y-auto z-50 p-2 animate-in fade-in slide-in-from-top-2">
                   {filteredServices.length > 0 ? (
                     filteredServices.map(s => (
                       <div 
                         key={s.id}
                         onMouseDown={() => { setSearchQuery(s.id); setIsServiceOpen(false); }}
                         className="px-4 py-3 hover:bg-slate-50 cursor-pointer rounded-xl font-bold text-slate-700 hover:text-primary transition-colors flex flex-col"
                       >
                         <span>{s.label}</span>
                       </div>
                     ))
                   ) : (
                     <div className="px-4 py-3 text-slate-400 text-sm">Услуга не найдена. Попробуйте другой запрос.</div>
                   )}
                 </div>
               )}
            </div>

            <div className="hidden sm:block w-px bg-slate-100 my-4" />

            <div 
              className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer relative group"
              onClick={() => setIsCityOpen(!isCityOpen)}
              onBlur={() => setTimeout(() => setIsCityOpen(false), 200)}
              tabIndex={0}
            >
               <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0">
                 <MapPin size={24} weight="duotone" />
               </div>
               <div className="text-left w-full flex flex-col pointer-events-none">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ваш город</label>
                 <div className={`w-full font-bold pl-1 text-sm sm:text-base ${cityQuery ? 'text-slate-900' : 'text-slate-400 font-normal'}`}>
                   {cityQuery || "Любой город"}
                 </div>
               </div>
               <CaretDown size={16} weight="bold" className={`text-slate-300 absolute right-4 transition-transform duration-200 ${isCityOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary'}`} />

               {/* Dropdown Menu for Cities */}
               {isCityOpen && (
                 <div className="absolute top-full left-0 mt-3 w-[calc(100%+2rem)] sm:w-full -ml-4 sm:ml-0 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2">
                   <div 
                     onMouseDown={() => { setCityQuery(""); setIsCityOpen(false); }}
                     className={`px-4 py-3 cursor-pointer rounded-xl font-bold transition-colors ${cityQuery === "" ? 'bg-primary/5 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                   >
                     Любой город
                   </div>
                   {CITIES.map(c => (
                     <div 
                       key={c}
                       onMouseDown={() => { setCityQuery(c); setIsCityOpen(false); }}
                       className={`px-4 py-3 cursor-pointer rounded-xl font-bold transition-colors ${cityQuery === c ? 'bg-primary/5 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                     >
                       {c}
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto px-10 rounded-[1.5rem] shrink-0 font-bold text-lg shadow-lg shadow-primary/20">
              Поиск
            </Button>
          </form>
        </div>
      </section>

      {/* Popular Clinics Section */}
      <section className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Популярные клиники</h2>
            <p className="text-slate-600">На основе рейтинга и отзывов пациентов</p>
          </div>
          <Link to="/clinics">
            <Button variant="outline">Смотреть все</Button>
          </Link>
        </div>

        {popularClinics.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {popularClinics.map((clinic) => (
              <Card key={clinic.id} noPadding className="flex flex-col overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors">
                <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={16} weight="fill" className="text-amber-400" />
                    <span className="font-semibold text-sm text-slate-800">{clinic.rating}</span>
                  </div>
                </div>

                <CardContent className="flex flex-col flex-1 p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm gap-1">
                      <Hospital size={14} />
                      <span className="truncate">{clinic.city}, {clinic.address}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 flex-1">{clinic.description}</p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">Врачей: </span>
                      <span className="font-medium text-slate-900">{clinic.dentist_count}</span>
                    </div>
                    <Link to={`/clinics/${clinic.id}`}>
                      <Button variant="secondary" size="sm">Подробнее</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 scroll-mt-20 max-w-7xl mx-auto">
        <div className="space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900">Как это работает</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Всего три простых шага к здоровой улыбке без звонков и очередей</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-teal-100 via-cyan-200 to-blue-100 -z-10" />
            
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center font-black text-3xl shadow-sm border border-teal-100">1</div>
              <h3 className="font-bold text-xl text-slate-900">Выберите врача</h3>
              <p className="text-sm text-slate-500 max-w-xs">Сравните врачей по рейтингу, отзывам и стоимости услуг в удобном для вас районе.</p>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-cyan-50 text-cyan-600 rounded-3xl flex items-center justify-center font-black text-3xl shadow-sm border border-cyan-100">2</div>
              <h3 className="font-bold text-xl text-slate-900">Запишитесь онлайн</h3>
              <p className="text-sm text-slate-500 max-w-xs">Выберите свободное время в расписании врача и подтвердите запись в один клик.</p>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-black text-3xl shadow-sm border border-blue-100">3</div>
              <h3 className="font-bold text-xl text-slate-900">Придите на прием</h3>
              <p className="text-sm text-slate-500 max-w-xs">Получите лечение без очередей. Платформа напомнит вам о визите заранее.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Clinics / Partners Section */}
      <section id="partners" className="relative bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 overflow-hidden scroll-mt-20 max-w-7xl mx-auto mt-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10">
                <Star size={14} weight="fill" className="text-amber-400" /> B2B Платформа
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Управляйте клиникой <br/><span className="text-primary">эффективнее</span>
              </h2>
              <p className="text-slate-300 text-lg max-w-md">
                Подключите вашу стоматологию к платформе Dentist. Привлекайте новых пациентов, управляйте расписанием врачей и получайте детальную аналитику.
              </p>
            </div>
            
            <ul className="space-y-4 text-slate-200 font-medium pb-2">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Бесплатное размещение в каталоге</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Удобная CRM для администратора</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> Снижение количества неявок</li>
            </ul>

            <Link to="/register" className="block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-bold px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white">
                Подключить клинику
              </Button>
            </Link>
          </div>
          
          <div className="hidden lg:block relative h-full min-h-[300px]">
            {/* Minimal Dashboard Mockup for Visuals */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-2 mb-6 px-2">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <div className="w-3 h-3 rounded-full bg-emerald-400" />
               </div>
               <div className="space-y-4">
                 <div className="h-24 bg-white/10 rounded-xl" />
                 <div className="flex gap-4">
                   <div className="h-32 flex-1 bg-white/10 rounded-xl" />
                   <div className="h-32 flex-1 bg-white/10 rounded-xl" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-16 scroll-mt-20 border-t border-slate-100 mt-12 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900">Остались вопросы?</h2>
            <p className="text-slate-600 text-lg">Свяжитесь с нашей службой поддержки, и мы с радостью вам поможем.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Star size={32} weight="duotone" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">Телефон поддержки</h3>
                  <p className="text-slate-500 mt-1 font-medium">Ежедневно с 9:00 до 20:00</p>
                  <a href="tel:+77000000000" className="block mt-4 font-black text-primary text-xl hover:underline">+7 (700) 000-00-00</a>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Hospital size={32} weight="duotone" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">Письмо на почту</h3>
                  <p className="text-slate-500 mt-1 font-medium">Для партнеров и предложений</p>
                  <a href="mailto:hello@dentist.kz" className="block mt-4 font-black text-primary text-xl hover:underline">hello@dentist.kz</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
