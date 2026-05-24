import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Gem, Sparkles } from 'lucide-react';
import { useCart } from '../store/CartContext';

interface NavbarProps {
  openCart: () => void;
}

export default function Navbar({ openCart }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Início', to: '/' },
    { label: 'Catálogo', to: '/catalogo' },
    { label: 'Provador IA', to: '/provador', highlight: true },
    { label: 'Sobre', to: '/sobre' },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg shadow-black/30'
            : 'bg-[#0A0A0A]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Gem
                  size={24}
                  className="transition-all duration-300 group-hover:scale-110"
                  style={{ color: '#F0B429' }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl text-white tracking-widest">DNZ</span>
                <span className="text-[10px] font-semibold tracking-[0.3em]" style={{ color: '#F0B429' }}>
                  OUTLET
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    link.highlight
                      ? 'flex items-center gap-1.5'
                      : ''
                  } ${
                    isActive(link.to)
                      ? link.highlight
                        ? 'text-[#0A0A0A]'
                        : 'text-white'
                      : link.highlight
                      ? 'text-[#0A0A0A]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={
                    link.highlight
                      ? {
                          backgroundColor: '#F0B429',
                          boxShadow: isActive(link.to)
                            ? '0 0 16px rgba(240,180,41,0.5)'
                            : undefined,
                        }
                      : undefined
                  }
                >
                  {link.highlight && <Sparkles size={14} />}
                  {link.label}
                  {!link.highlight && isActive(link.to) && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#F0B429' }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={openCart}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E1E] transition-all duration-200"
                aria-label="Abrir carrinho"
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-black flex items-center justify-center px-0.5"
                    style={{ backgroundColor: '#F0B429' }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E1E] transition-all duration-200"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  link.highlight
                    ? 'text-[#0A0A0A] font-bold'
                    : isActive(link.to)
                    ? 'text-white bg-[#1E1E1E]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
                style={link.highlight ? { backgroundColor: '#F0B429' } : undefined}
              >
                {link.highlight && <Sparkles size={14} />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
