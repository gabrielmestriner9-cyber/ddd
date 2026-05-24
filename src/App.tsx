import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { CartProvider } from './store/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import FittingRoom from './pages/FittingRoom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);

  const whatsappLink = 'https://wa.me/5515999999999?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos%20da%20DNZ%20Outlet.';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <ScrollToTop />
      <Navbar openCart={() => setCartOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/provador" element={<FittingRoom />} />
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />

      {/* Cart drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* WhatsApp floating button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
        style={{
          backgroundColor: '#25D366',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        }}
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={26} className="text-white" />
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}
