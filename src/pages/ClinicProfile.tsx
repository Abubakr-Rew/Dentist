import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, Clock, Phone, GraduationCap, ArrowLeft, CheckCircle, CaretRight } from "@phosphor-icons/react";
import { Button, Card, CardContent } from "../components/ui";
import { mockClinics } from "../mocks/data";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { getClinicBreadcrumbs } from "../lib/routes/breadcrumbs";

export default function ClinicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const clinic = mockClinics.find((c) => c.id === id);

  if (!clinic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Клиника не найдена</h2>
        <p className="text-slate-500 mb-6">Возможно, ссылка устарела или клиника была удалена.</p>
        <Link to="/clinics">
          <Button>Вернуться к списку</Button>
        </Link>
      </div>
    );
  }

  // Extract all unique services from all dentists in the clinic
  const allServices = Array.from(
    new Map(clinic.dentists.flatMap((d) => d.services).map((s) => [s.id, s])).values()
  );

  const selectedService = allServices.find(s => s.id === selectedServiceId);
  const availableDoctors = selectedServiceId 
    ? clinic.dentists.filter(d => d.services.some(s => s.id === selectedServiceId))
    : [];

  return (
    <div className="space-y-8 -mt-4 pb-12 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <Breadcrumbs items={getClinicBreadcrumbs(clinic.name)} />

      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 relative bg-slate-100 shadow-inner">
          <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Star size={16} weight="fill" className="text-amber-400" />
            <span className="font-bold text-slate-800">{clinic.rating}</span>
          </div>
        </div>

        <div className="flex-1 space-y-6 z-10 w-full">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{clinic.name}</h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">{clinic.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
              <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
                <MapPin size={20} weight="bold" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">Адрес</p>
                <p className="font-medium text-sm">{clinic.city}, {clinic.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
              <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
                <Clock size={20} weight="bold" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">Часы работы</p>
                <p className="font-medium text-sm">Пн-Вс: 09:00 - 20:00</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100/50 sm:col-span-2 md:col-span-1 lg:col-span-2">
              <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
                <Phone size={20} weight="bold" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">Телефон</p>
                <p className="font-medium text-sm">{clinic.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-based Booking Flow */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Progress header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${!selectedServiceId ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
              {!selectedServiceId ? "1" : <CheckCircle size={20} weight="bold" />}
            </div>
            <h2 className={`text-lg font-bold ${!selectedServiceId ? 'text-slate-900' : 'text-slate-500'}`}>Выберите услугу</h2>
          </div>
          
          <div className="h-px bg-slate-200 flex-1 mx-6 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${selectedServiceId ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
              2
            </div>
            <h2 className={`text-lg font-bold ${selectedServiceId ? 'text-slate-900' : 'text-slate-400'}`}>Врач и время</h2>
          </div>
        </div>

        {/* Step 1: Services List */}
        {!selectedServiceId && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className="bg-white text-left p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-primary hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors leading-tight">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      ~{service.durationMinutes} мин
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">{service.price.toLocaleString("ru-RU")} ₸</span>
                    <CaretRight size={20} weight="bold" className="text-slate-400 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doctors List */}
        {selectedServiceId && selectedService && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setSelectedServiceId(null)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} weight="bold" />
              Назад к выбору услуги
            </button>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Выбранная услуга:</p>
                <h3 className="text-lg font-bold text-slate-900">{selectedService.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">{selectedService.price.toLocaleString("ru-RU")} ₸</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6">Доступные специалисты</h3>

            {availableDoctors.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 gap-2 flex flex-col items-center">
                <GraduationCap size={48} weight="duotone" className="text-slate-300 mb-2" />
                <p>К сожалению, сейчас нет свободных врачей на эту услугу.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDoctors.map((dentist) => {
                  // Find exactly how long and how much this specific dentist charges for the service
                  const dentService = dentist.services.find(s => s.id === selectedServiceId) || selectedService;

                  return (
                    <Card key={dentist.id} noPadding className="flex flex-col overflow-hidden hover:shadow-md hover:border-primary/40 transition-all duration-300 border-slate-200">
                      <div className="p-6 flex gap-4 items-center bg-white border-b border-slate-100">
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-white ring-4 ring-slate-50 shadow-sm shrink-0">
                          <img src={dentist.photo} alt={dentist.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{dentist.name}</h3>
                          <p className="text-primary font-medium text-sm">{dentist.specialization}</p>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1 space-y-6 bg-slate-50/50">
                        <div className="flex items-center gap-2 text-slate-600 bg-white w-fit px-3 py-1.5 rounded-lg text-sm border border-slate-100 shadow-sm">
                          <GraduationCap size={18} weight="bold" className="text-slate-400" />
                          <span>Стаж: <strong className="text-slate-900 font-semibold">{dentist.experience} лет</strong></span>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                            <Clock size={16} weight="bold" className="text-slate-400" /> 
                            Длительность: <span>~{dentService.durationMinutes} мин</span>
                          </p>
                        </div>

                        <Button 
                          className="w-full shadow-sm hover:shadow active:scale-[0.98] transition-all" 
                          onClick={() => navigate(`/booking?clinic=${clinic.id}&service=${selectedServiceId}&dentist=${dentist.id}`)}
                        >
                          Выбрать время
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
