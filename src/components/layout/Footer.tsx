import { Tooth } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Tooth size={24} weight="duotone" className="text-primary" />
            <span className="font-bold text-lg text-gray-900">Dentist</span>
          </div>
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Dentist Platform. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
