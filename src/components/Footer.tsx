import { Link } from 'react-router-dom';
import { Gem, MapPin, Phone, Instagram, Truck, Sparkles } from 'lucide-react';

export default function Footer() {
  const whatsappNumber = '5515999999999';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const instagramLink = 'https://instagram.com/dnzoutlet.boituva';

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #F0B429, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <Gem size={28} style={{ color: '#F0B429' }} className="group-hover:scale-110 transition-transform" />
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl text-white tracking-widest">DNZ</span>
                <span className="text-[11px] font-semibold tracking-[0.3em]" style={{ color: '#F0B429' }}>
                  OUTLET
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Qualidade, procedência e preço baixo. Streetwear e moda urbana com as melhores marcas.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#F0B429' }}>
              <Truck size={16} />
              <span>Entregamos para todo o Brasil 🇧🇷</span>
            </div>
          </div>

          {/* Links column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-sm tracking-widest uppercase">Navegação</h3>
            <nav className="flex flex-col gap-2">
              <Link
                to="/catalogo"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 w-fit"
              >
                Catálogo
              </Link>
              <Link
                to="/provador"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 w-fit"
                style={{ color: '#F0B429' }}
              >
                <Sparkles size={13} />
                Provador IA
              </Link>
              <Link
                to="/sobre"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 w-fit"
              >
                Sobre
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 w-fit"
              >
                Contato
              </a>
            </nav>
          </div>

          {/* Contact column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-sm tracking-widest uppercase">Contato</h3>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <Phone size={14} className="text-white" />
                </div>
                <span>WhatsApp</span>
              </a>

              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                >
                  <Instagram size={14} className="text-white" />
                </div>
                <span>@dnzoutlet.boituva</span>
              </a>

              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#F0B429' }} />
                <div>
                  <p>Rua São Roque, 68 - Centro</p>
                  <p>Boituva - SP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © 2024 DNZ Outlet. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs">
            Nike · Adidas · Balenciaga · Balmain · e muito mais
          </p>
        </div>
      </div>
    </footer>
  );
}
