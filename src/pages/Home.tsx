import { Link } from "react-router-dom";
import { Search, MapPin, Star } from "lucide-react";
import { Button, Input, Card, CardContent } from "../components/ui";
import { mockClinics } from "../mocks/data";

export default function Home() {
  const popularClinics = mockClinics.slice(0, 3); // Take first 3 for the popular section

  return (
    <div className="-mt-8 space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Найдите лучшего стоматолога и <span className="text-primary">запишитесь онлайн</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Сотни проверенных клиник, реальные отзывы пациентов и моментальное бронирование удобного времени.
            </p>
          </div>

          {/* Quick Search */}
          <div className="bg-white p-2 sm:p-3 rounded-2xl shadow-lg border border-slate-100 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Услуга, врач или клиника"
                className="w-full pl-10 pr-4 py-3 sm:py-0 h-full text-slate-900 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="hidden sm:block w-px bg-slate-200 my-2" />
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Город или район"
                className="w-full pl-10 pr-4 py-3 sm:py-0 h-full text-slate-900 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              />
            </div>

            <Button size="lg" className="w-full sm:w-auto px-8 rounded-xl shrink-0">
              Найти
            </Button>
          </div>
          
          <div className="pt-4 flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-slate-500">
            <span>Часто ищут:</span>
            <Link to="/clinics?q=Кариес" className="text-primary hover:underline">Лечение кариеса</Link>
            <Link to="/clinics?q=Брекеты" className="text-primary hover:underline">Брекеты</Link>
            <Link to="/clinics?q=Отбеливание" className="text-primary hover:underline">Отбеливание</Link>
          </div>
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
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-sm text-slate-800">{clinic.rating}</span>
                </div>
              </div>
              
              <CardContent className="flex flex-col flex-1 p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {clinic.name}
                  </h3>
                  <div className="flex items-center text-slate-500 text-sm gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{clinic.city}, {clinic.address}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 flex-1">
                  {clinic.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-slate-500">Врачей: </span>
                    <span className="font-medium text-slate-900">{clinic.dentists.length}</span>
                  </div>
                  <Link to={`/clinics/${clinic.id}`}>
                    <Button variant="secondary" size="sm">Подробнее</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
