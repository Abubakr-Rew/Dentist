import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If a hash is present, smoothly scroll to that element
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      // Otherwise scroll to the top of the page on route change
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash, key]);

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
