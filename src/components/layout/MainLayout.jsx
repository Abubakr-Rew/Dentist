import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto items-stretch px-4 sm:px-6 lg:px-8 py-8">
        {/* Outlet is where the nested routes will render */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
