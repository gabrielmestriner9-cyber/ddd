import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronRight,
  Shirt,
  ShoppingBag,
  Gem,
  Wind,
  Package,
  Instagram,
  Users,
  Truck,
  BadgeCheck,
  Camera,
  Ruler,
  Zap,
} from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const categories = [
  { label: 'Camisetas', icon: Shirt, slug: 'blusas' },
  { label: 'Calças', icon: Package, slug: 'calcas' },
  { label: 'Jaquetas', icon: Wind, slug: 'jaquetas' },
  { label: 'Tênis', icon: ShoppingBag, slug: 'acessorios' },
  { label: 'Bonés', icon: Gem, slug: 'acessorios' },
  { label: 'Perfumes', icon: Sparkles, slug: 'acessorios' },
];

const instagramColors = [
  'from-purple-900 to-pink-700',
  'from-yellow-900 to-orange-700',
  'from-gray-800 to-gray-600',
  'from-blue-900 to-indigo-700',
  'from-green-900 to-teal-700',
  'from-red-900 to-rose-700',
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: '#F0B429' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: '#F0B429' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(240,180,41,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-30 animate-pulse"
            style={{
              backgroundColor: '#F0B429',
              left: `${(i * 6.25) % 100}%`,
              top: `${((i * 13) + 10) % 80}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-medium mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            BOITUVA • SP
          </div>

          <h1 className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none tracking-tighter mb-4">
            DNZ
            <br />
            <span style={{ WebkitTextStroke: '2px #F0B429', color: 'transparent' }}>
              OUTLET
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl font-medium tracking-[0.3em] uppercase mb-10">
            Vivências &amp; Vendas
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/catalogo"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black text-sm transition-all hover:scale-105 active:scale-95 hover:shadow-lg"
              style={{ backgroundColor: '#F0B429', boxShadow: '0 0 30px rgba(240,180,41,0.3)' }}
            >
              Ver Catálogo
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/provador"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-sm border border-white/20 hover:border-[#F0B429]/60 hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles size={16} style={{ color: '#F0B429' }} />
              Provar com IA ✨
            </Link>
          </div>

          {/* Floating badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Users, label: '6K+ Seguidores' },
              { icon: Truck, label: 'Entrega Brasil' },
              { icon: BadgeCheck, label: 'Original' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium backdrop-blur-sm"
              >
                <Icon size={13} style={{ color: '#F0B429' }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#F0B429] to-transparent animate-pulse" />
          <span className="text-[10px] text-gray-500 tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ─── PROMO MARQUEE ─────────────────────────────────── */}
      <div className="py-3 border-y border-white/10 overflow-hidden" style={{ backgroundColor: '#F0B429' }}>
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <span key={idx} className="inline-block text-black text-xs font-black tracking-widest uppercase px-8">
              COMPRE UMA CALÇA E GANHE UMA CAMISETA
              <span className="mx-6">•</span>
              FRETE GRÁTIS ACIMA DE R$299
              <span className="mx-6">•</span>
              NOVIDADES TODO DIA NOS STORIES
              <span className="mx-6">•</span>
              NIKE · ADIDAS · BALENCIAGA · BALMAIN
              <span className="mx-6">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <RevealSection>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white font-black text-2xl sm:text-3xl">
              Categorias
            </h2>
            <Link
              to="/catalogo"
              className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: '#F0B429' }}
            >
              Ver tudo <ChevronRight size={14} />
            </Link>
          </div>
        </RevealSection>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(({ label, icon: Icon, slug }) => (
            <Link
              key={label}
              to={`/catalogo?categoria=${slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/10 bg-[#161616] hover:border-[#F0B429]/40 hover:bg-[#1E1E1E] transition-all duration-200 group min-w-[110px]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: 'rgba(240,180,41,0.1)' }}
              >
                <Icon size={22} style={{ color: '#F0B429' }} />
              </div>
              <span className="text-gray-400 group-hover:text-white text-xs font-semibold transition-colors text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <RevealSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-white font-black text-2xl sm:text-3xl">Produtos em Destaque</h2>
              <p className="text-gray-500 text-sm mt-1">As melhores peças selecionadas para você</p>
            </div>
            <Link
              to="/catalogo"
              className="hidden sm:flex text-sm font-medium items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: '#F0B429' }}
            >
              Ver catálogo completo <ChevronRight size={14} />
            </Link>
          </div>
        </RevealSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {featuredProducts.map((product, i) => (
            <div
              key={product.id}
              className="transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border border-white/20 text-white hover:border-[#F0B429]/60 hover:bg-white/5 transition-all hover:scale-105"
          >
            Ver todos os produtos
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── AI FITTING ROOM FEATURE ──────────────────────── */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <RevealSection>
              <div className="flex flex-col gap-6">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold w-fit"
                  style={{ backgroundColor: 'rgba(240,180,41,0.15)', color: '#F0B429' }}
                >
                  <Sparkles size={12} />
                  INTELIGÊNCIA ARTIFICIAL
                </div>

                <h2 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  PROVADOR
                  <br />
                  <span style={{ color: '#F0B429' }}>VIRTUAL</span>
                  <br />
                  COM IA
                </h2>

                <p className="text-gray-400 text-base leading-relaxed max-w-md">
                  Tire uma foto e deixe nossa IA recomendar o tamanho perfeito baseado nas suas medidas. Sem devoluções, sem surpresas.
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Camera, title: 'Tire sua foto', desc: 'Upload ou use a câmera do celular' },
                    { icon: Ruler, title: 'Informe suas medidas', desc: 'Altura, peso e medidas corporais' },
                    { icon: Zap, title: 'Receba a recomendação', desc: 'IA analisa e sugere o tamanho ideal' },
                  ].map(({ title, desc }, i) => (
                    <div key={title} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm"
                        style={{ backgroundColor: '#F0B429', color: '#0A0A0A' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/provador"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black text-sm transition-all hover:scale-105 active:scale-95 w-fit"
                  style={{ backgroundColor: '#F0B429', boxShadow: '0 0 30px rgba(240,180,41,0.25)' }}
                >
                  <Sparkles size={16} />
                  Experimentar Agora
                </Link>
              </div>
            </RevealSection>

            {/* Right - Phone mockup */}
            <RevealSection>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-[3rem] blur-2xl opacity-30"
                    style={{ backgroundColor: '#F0B429', transform: 'scale(0.85)' }}
                  />
                  {/* Phone */}
                  <div
                    className="relative w-64 h-[520px] rounded-[3rem] border-4 border-white/10 flex flex-col overflow-hidden"
                    style={{ backgroundColor: '#161616' }}
                  >
                    {/* Phone notch */}
                    <div className="h-8 flex items-center justify-center">
                      <div className="w-20 h-1.5 bg-[#1E1E1E] rounded-full" />
                    </div>

                    {/* Screen content */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                      {/* Scan animation */}
                      <div
                        className="relative w-32 h-40 rounded-xl overflow-hidden"
                        style={{ backgroundColor: '#1E1E1E' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                            <Camera size={24} className="text-gray-500" />
                          </div>
                        </div>
                        {/* Scan line */}
                        <div
                          className="absolute left-0 right-0 h-0.5 scan-animation"
                          style={{ backgroundColor: '#F0B429' }}
                        />
                        {/* Corner markers */}
                        {[
                          'top-2 left-2 border-t-2 border-l-2',
                          'top-2 right-2 border-t-2 border-r-2',
                          'bottom-2 left-2 border-b-2 border-l-2',
                          'bottom-2 right-2 border-b-2 border-r-2',
                        ].map((cls, i) => (
                          <div
                            key={i}
                            className={`absolute w-4 h-4 ${cls}`}
                            style={{ borderColor: '#F0B429' }}
                          />
                        ))}
                      </div>

                      <div className="text-center">
                        <div
                          className="text-4xl font-black mb-1"
                          style={{ color: '#F0B429' }}
                        >
                          TAMANHO M
                        </div>
                        <div className="text-gray-400 text-xs">Ajuste Perfeito • 94%</div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[#1E1E1E] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: '94%', backgroundColor: '#F0B429' }}
                        />
                      </div>

                      <div className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-black"
                        style={{ backgroundColor: '#F0B429' }}>
                        Adicionar ao Carrinho
                      </div>
                    </div>

                    {/* Home bar */}
                    <div className="h-8 flex items-center justify-center">
                      <div className="w-24 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM SECTION ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Instagram size={20} style={{ color: '#F0B429' }} />
              <h2 className="text-white font-black text-2xl">
                SIGA{' '}
                <a
                  href="https://instagram.com/dnzoutlet.boituva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                  style={{ color: '#F0B429' }}
                >
                  @DNZOUTLET.BOITUVA
                </a>
              </h2>
            </div>
            <p className="text-gray-500 text-sm">Novidades, looks e promoções todo dia nos stories</p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {instagramColors.map((gradient, i) => (
            <a
              key={i}
              href="https://instagram.com/dnzoutlet.boituva"
              target="_blank"
              rel="noopener noreferrer"
              className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group overflow-hidden hover:scale-105 transition-transform duration-200`}
            >
              <Instagram
                size={20}
                className="text-white/30 group-hover:text-white/60 transition-colors"
              />
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://instagram.com/dnzoutlet.boituva"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/20 text-white hover:border-[#F0B429]/60 transition-all"
          >
            <Instagram size={16} />
            Seguir no Instagram
          </a>
        </div>
      </section>
    </div>
  );
}
