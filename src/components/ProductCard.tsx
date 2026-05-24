import { Link, useNavigate } from 'react-router-dom';
import { Star, Sparkles } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-[#161616] rounded-2xl overflow-hidden border border-white/5 hover:border-[#F0B429]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#F0B429]/5 flex flex-col">
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#1E1E1E]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full text-black"
              style={{ backgroundColor: '#F0B429' }}>
              NOVO
            </span>
          )}
          {product.isSale && discount > 0 && (
            <span className="text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          )}
          {product.isSale && !discount && (
            <span className="text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full bg-red-500 text-white">
              OFERTA
            </span>
          )}
        </div>

        {/* Hover quick action */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => navigate(`/provador?product=${product.id}`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-black transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#F0B429' }}
          >
            <Sparkles size={12} />
            Provar com IA
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#F0B429] transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? '#F0B429' : 'none'}
                stroke={i < Math.floor(product.rating) ? '#F0B429' : '#4B5563'}
              />
            ))}
          </div>
          <span className="text-gray-500 text-[11px]">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-gray-600 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-white font-black text-lg leading-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Colors preview */}
          {product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color.name}
                  title={color.name}
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action button */}
        <Link
          to={`/produto/${product.id}`}
          className="w-full text-center py-2.5 rounded-xl text-sm font-bold border border-white/10 text-gray-300 hover:border-[#F0B429]/60 hover:text-white hover:bg-[#1E1E1E] transition-all duration-200 active:scale-95"
        >
          Ver Produto
        </Link>
      </div>
    </div>
  );
}
