import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "../components/ui";

export default function Home() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-foreground">Home</h1>

      {/* ---- Buttons ---- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* ---- Inputs ---- */}
      <section className="max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Inputs</h2>
        <Input label="Имя" placeholder="Введите ваше имя" />
        <Input label="Email" type="email" placeholder="you@example.com" helperText="Мы не передаём ваш email третьим лицам." />
        <Input label="Телефон" error="Обязательное поле" />
      </section>

      {/* ---- Card ---- */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Smile Clinic</CardTitle></CardHeader>
            <CardContent>Современная стоматологическая клиника с полным спектром услуг.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>DentaPro</CardTitle></CardHeader>
            <CardContent>Премиум стоматология с оборудованием из Германии.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Здоровая Улыбка</CardTitle></CardHeader>
            <CardContent>Семейная клиника с уютной атмосферой.</CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
