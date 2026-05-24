import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products } from '../data/products';
import type { Category } from '../types';
import ProductCard from '../components/ProductCard';

const categoryLabels: Record<Category, string> = {
  vestidos: 'Vestidos',
  calcas: 'Calças',
  blusas: 'Camisetas',
  conjuntos: 'Conjuntos',
  saias: 'Saias',
  shorts: 'Shorts',
  jaquetas: 'Jaquetas',
  acessorios: 'Acessórios',
};

const sortOptions = [
  { value: 'relevance', label: 'Mais relevante' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'newest', label: 'Novidades' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const search = searchParams.get('q') || '';
  const categoryParam = searchParams.get('categoria') as Category | null;
  const sortParam = searchParams.get('sort') || 'relevance';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 10000);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const availableCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats) as Category[];
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }

    if (categoryParam) {
      result = result.filter((p) => p.category === categoryParam);
    }

    result = result.filter(
      (p) => p.price >= minPrice && (maxPrice >= 10000 || p.price <= maxPrice)
    );

    switch (sortParam) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [search, categoryParam, sortParam, minPrice, maxPrice]);

  const hasActiveFilters = !!search || !!categoryParam || minPrice > 0 || maxPrice < 10000;
  const currentSort = sortOptions.find((s) => s.value === sortParam) || sortOptions[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Header */}
      <div className="bg-[#0D0D0D] border-b border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white font-black text-3xl sm:text-4xl mb-1">Catálogo</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setParam('q', e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F0B429]/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setParam('q', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filters toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all"
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all"
              >
                {currentSort.label}
                <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#161616] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl shadow-black/50">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setParam('sort', opt.value); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortParam === opt.value
                            ? 'text-white font-semibold'
                            : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
                        }`}
                        style={sortParam === opt.value ? { color: '#F0B429' } : undefined}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setParam('categoria', '')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !categoryParam
                ? 'text-black'
                : 'bg-[#161616] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
            style={!categoryParam ? { backgroundColor: '#F0B429' } : undefined}
          >
            Todos
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setParam('categoria', categoryParam === cat ? '' : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                categoryParam === cat
                  ? 'text-black'
                  : 'bg-[#161616] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
              style={categoryParam === cat ? { backgroundColor: '#F0B429' } : undefined}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Price filter (desktop) */}
        <div
          className={`sm:flex items-center gap-4 mb-6 ${mobileFiltersOpen ? 'flex' : 'hidden'}`}
        >
          <span className="text-gray-500 text-sm flex-shrink-0">Preço:</span>
          {[
            { label: 'Até R$100', min: 0, max: 100 },
            { label: 'R$100 - R$200', min: 100, max: 200 },
            { label: 'R$200 - R$350', min: 200, max: 350 },
            { label: 'Acima de R$350', min: 350, max: 10000 },
          ].map((range) => {
            const active = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  if (active) {
                    next.delete('minPrice');
                    next.delete('maxPrice');
                  } else {
                    next.set('minPrice', String(range.min));
                    next.set('maxPrice', String(range.max));
                  }
                  setSearchParams(next);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  active
                    ? 'text-black border-transparent'
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
                style={active ? { backgroundColor: '#F0B429' } : undefined}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-gray-500 text-xs">Filtros ativos:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E1E1E] border border-white/10 text-xs text-gray-300">
                "{search}"
                <button onClick={() => setParam('q', '')} className="hover:text-white ml-1">
                  <X size={11} />
                </button>
              </span>
            )}
            {categoryParam && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E1E1E] border border-white/10 text-xs text-gray-300">
                {categoryLabels[categoryParam]}
                <button onClick={() => setParam('categoria', '')} className="hover:text-white ml-1">
                  <X size={11} />
                </button>
              </span>
            )}
            {(minPrice > 0 || maxPrice < 10000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E1E1E] border border-white/10 text-xs text-gray-300">
                R${minPrice} - R${maxPrice < 10000 ? maxPrice : '∞'}
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('minPrice');
                    next.delete('maxPrice');
                    setSearchParams(next);
                  }}
                  className="hover:text-white ml-1"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: '#F0B429' }}
            >
              Limpar tudo
            </button>
          </div>
        )}

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Search size={48} className="text-gray-700" />
            <div className="text-center">
              <p className="text-gray-400 font-semibold text-lg">Nenhum produto encontrado</p>
              <p className="text-gray-600 text-sm mt-1">Tente ajustar os filtros ou a busca</p>
            </div>
            <button
              onClick={clearFilters}
              className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105"
              style={{ backgroundColor: '#F0B429' }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
