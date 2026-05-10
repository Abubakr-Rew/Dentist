import { useState } from "react";
import { Plus, X, CheckCircle, PencilSimple } from "@phosphor-icons/react";
import { ClinicDetail as Clinic, clinicsApi, Service, Dentist } from "../../services/api";
import { Button, Card, CardContent, Input } from "../ui";

interface ClinicDoctorsTabProps {
  clinic: Clinic;
}

export default function ClinicDoctorsTab({ clinic }: ClinicDoctorsTabProps) {
  // Add Doctor
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "", specialization: "", experience: 0,
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200",
  });
  const [newServices, setNewServices] = useState<{ name: string; price: number; duration: number }[]>([
    { name: "", price: 0, duration: 30 }
  ]);

  // Edit Doctor
  const [editingDoctor, setEditingDoctor] = useState<Dentist | null>(null);
  const [editForm, setEditForm] = useState({ name: "", specialization: "", experience: 0, photo: "" });

  // Add Service to existing doctor
  const [addingServiceFor, setAddingServiceFor] = useState<string | null>(null);
  const [newService, setNewService] = useState({ name: "", price: 0, duration: 30 });

  // Toast
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
      window.location.reload();
    }, 1500);
  };



  const handleAddDoctor = async () => {
    try {
      const services: Service[] = newServices
        .filter(s => s.name.trim())
        .map(s => ({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: s.name,
          price: s.price || 0,
          duration_minutes: s.duration || 30,
        }));
      if (services.length === 0) {
        services.push({ id: Date.now().toString(), name: "Консультация", price: 5000, duration_minutes: 30 });
      }
      await clinicsApi.addDentist(String(clinic.id), {
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        experience: newDoctor.experience,
        photo: newDoctor.photo,
        services,
      });
      setIsAddingDoctor(false);
      showSuccess("Врач успешно добавлен!");
    } catch (e) {
      console.error(e);
      alert("Ошибка при добавлении врача");
    }
  };

  const handleEditDoctor = async () => {
    if (!editingDoctor) return;
    try {
      await clinicsApi.updateDentist(String(clinic.id), String(editingDoctor.id), {
        name: editForm.name,
        specialization: editForm.specialization,
        experience: editForm.experience,
        photo: editForm.photo,
      } as any);
      setEditingDoctor(null);
      showSuccess("Врач обновлён!");
    } catch (e) {
      console.error(e);
      alert("Ошибка при обновлении");
    }
  };

  const handleAddService = async () => {
    if (!addingServiceFor) return;
    try {
      await clinicsApi.addServiceToDentist(String(clinic.id), addingServiceFor, {
        id: Date.now().toString(),
        name: newService.name,
        price: newService.price,
        duration_minutes: newService.duration,
      });
      setAddingServiceFor(null);
      showSuccess("Услуга добавлена!");
    } catch (e) {
      console.error(e);
      alert("Ошибка при добавлении услуги");
    }
  };


  const openEdit = (dentist: Dentist) => {
    setEditForm({
      name: dentist.name,
      specialization: dentist.specialization,
      experience: dentist.experience,
      photo: dentist.photo,
    });
    setEditingDoctor(dentist);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-50 border border-emerald-200 text-emerald-600 px-5 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} weight="fill" />
          {successMsg}
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Врачи и Услуги</h1>
          <p className="text-sm text-slate-500 font-medium">Управление персоналом и прейскурантом клиники</p>
        </div>
        <Button className="font-bold gap-2" onClick={() => setIsAddingDoctor(true)}>
          <Plus size={16} weight="bold" />
          Добавить врача
        </Button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {clinic.dentists.map((dentist) => (
          <Card key={dentist.id} className="border-slate-200">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={dentist.photo} alt={dentist.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{dentist.name}</h3>
                    <p className="text-sm text-slate-500">{dentist.specialization} • Стаж {dentist.experience} лет</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="font-bold gap-1.5" onClick={() => openEdit(dentist)}>
                    <PencilSimple size={14} /> Изменить
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Оказываемые услуги</p>
                  <button
                    className="text-xs font-bold text-primary hover:underline"
                    onClick={() => { setNewService({ name: "", price: 0, duration: 30 }); setAddingServiceFor(String(dentist.id)); }}
                  >
                    + Услуга
                  </button>
                </div>
                <ul className="space-y-2">
                  {dentist.services.map((service) => (
                    <li key={service.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {service.name} <span className="text-slate-400 text-xs">({service.duration_minutes} мин)</span>
                      </span>
                      <span className="font-bold text-slate-900">{service.price.toLocaleString()} ₸</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Add Doctor Modal ─── */}
      {isAddingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Новый врач</h3>
              <button onClick={() => setIsAddingDoctor(false)} className="text-slate-400 hover:text-slate-900"><X size={24} weight="bold" /></button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">ФИО врача</label>
                <Input value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} placeholder="Иванов Иван" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Специализация</label>
                  <Input value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} placeholder="Хирург" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Стаж (лет)</label>
                  <Input type="number" value={newDoctor.experience} onChange={(e) => setNewDoctor({ ...newDoctor, experience: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">URL фото</label>
                <Input value={newDoctor.photo} onChange={(e) => setNewDoctor({ ...newDoctor, photo: e.target.value })} placeholder="https://..." />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Услуги</p>
                  <button
                    className="text-xs font-bold text-primary hover:underline"
                    onClick={() => setNewServices([...newServices, { name: "", price: 0, duration: 30 }])}
                  >
                    + Ещё услуга
                  </button>
                </div>
                {newServices.map((s, i) => (
                  <div key={i} className="space-y-3 mb-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0 last:mb-0">
                    <Input
                      value={s.name}
                      onChange={(e) => { const c = [...newServices]; c[i].name = e.target.value; setNewServices(c); }}
                      placeholder="Название услуги"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        value={s.price || ""}
                        onChange={(e) => { const c = [...newServices]; c[i].price = Number(e.target.value); setNewServices(c); }}
                        placeholder="Цена (₸)"
                      />
                      <Input
                        type="number"
                        value={s.duration || ""}
                        onChange={(e) => { const c = [...newServices]; c[i].duration = Number(e.target.value); setNewServices(c); }}
                        placeholder="Мин"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full font-bold mt-2" onClick={handleAddDoctor}>Сохранить врача</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Doctor Modal ─── */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Редактировать врача</h3>
              <button onClick={() => setEditingDoctor(null)} className="text-slate-400 hover:text-slate-900"><X size={24} weight="bold" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">ФИО</label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Специализация</label>
                  <Input value={editForm.specialization} onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Стаж</label>
                  <Input type="number" value={editForm.experience} onChange={(e) => setEditForm({ ...editForm, experience: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">URL фото</label>
                <Input value={editForm.photo} onChange={(e) => setEditForm({ ...editForm, photo: e.target.value })} />
                {editForm.photo && (
                  <img src={editForm.photo} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                )}
              </div>
              <Button className="w-full font-bold" onClick={handleEditDoctor}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Service Modal ─── */}
      {addingServiceFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Новая услуга</h3>
              <button onClick={() => setAddingServiceFor(null)} className="text-slate-400 hover:text-slate-900"><X size={24} weight="bold" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Название</label>
                <Input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} placeholder="Отбеливание" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Цена (₸)</label>
                  <Input type="number" value={newService.price || ""} onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Мин.</label>
                  <Input type="number" value={newService.duration || ""} onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })} />
                </div>
              </div>
              <Button className="w-full font-bold" onClick={handleAddService}>Добавить услугу</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
