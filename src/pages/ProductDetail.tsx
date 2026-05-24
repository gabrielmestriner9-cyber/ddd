import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Sparkles,
  ShoppingCart,
  ChevronLeft,
  Plus,
  Minus,
  Ruler,
  X,
  Check,
} from 'lucide-react';
import { products, getRelatedProducts } from '../data/products';
import { useCart } from '../store/CartContext';
import type { Size, Color } from '../types';
import ProductCard from '../components/ProductCard';

const sizeGuide: Record<Size, { bust: string; waist: string; hip: string }> = {
  PP: { bust: 'até 80cm', waist: 'até 62cm', hip: 'até 86cm' },
  P: { bust: '80–88cm', waist: '62–70cm', hip: '86–94cm' },
  M: { bust: '88–96cm', waist: '70–78cm', hip: '94–102cm' },
  G: { bust: '96–104cm', waist: '78–86cm', hip: '102–110cm' },
  GG: { bust: '104–112cm', waist: '86–94cm', hip: '110–118cm' },
  XGG: { bust: 'acima de 112cm', waist: 'acima de 94cm', hip: 'acima de 118cm' },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    product ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-16 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Produto não encontrado.</p>
        <button
          onClick={() => navigate('/catalogo')}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-black"
          style={{ backgroundColor: '#F0B429' }}
        >
          Voltar ao catálogo
        </button>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-gray-300">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Image Gallery ── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative aspect-[3/4] bg-[#161616] rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-full text-black"
                    style={{ backgroundColor: '#F0B429' }}>NOVO</span>
                )}
                {product.isSale && discount > 0 && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-500 text-white">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{ borderColor: selectedImage === i ? '#F0B429' : 'transparent' }}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-6">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors w-fit"
            >
              <ChevronLeft size={16} />
              Voltar
            </button>

            <div>
              <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(product.rating) ? '#F0B429' : 'none'}
                      stroke={i < Math.floor(product.rating) ? '#F0B429' : '#4B5563'}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-white font-black text-4xl">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-red-400 text-xs font-bold">
                      Economize {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm mb-2.5">
                  Cor: <span className="text-white font-medium">{selectedColor?.name}</span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color)}
                      className="w-9 h-9 rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color.hex,
                        borderColor: selectedColor?.name === color.name ? '#F0B429' : 'rgba(255,255,255,0.2)',
                        boxShadow: selectedColor?.name === color.name ? '0 0 0 3px rgba(240,180,41,0.3)' : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-gray-400 text-sm">
                  Tamanho: <span className="text-white font-medium">{selectedSize || 'Selecione'}</span>
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ color: '#F0B429' }}
                >
                  <Ruler size={12} />
                  Guia de tamanhos
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:scale-105 ${
                      selectedSize === size
                        ? 'text-black border-transparent'
                        : 'bg-transparent border-white/15 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                    style={selectedSize === size ? { backgroundColor: '#F0B429' } : undefined}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-orange-400 text-xs mt-2">Selecione um tamanho para continuar</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className="text-gray-400 text-sm mb-2.5">Quantidade</p>
              <div className="flex items-center gap-3 bg-[#161616] border border-white/10 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E1E] transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-black text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E1E] transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all ${
                  !selectedSize || !selectedColor
                    ? 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-500'
                    : addedToCart
                    ? 'text-black'
                    : 'text-black hover:scale-[1.02] active:scale-95 hover:shadow-lg'
                }`}
                style={
                  selectedSize && selectedColor && !addedToCart
                    ? { backgroundColor: '#F0B429', boxShadow: '0 0 20px rgba(240,180,41,0.2)' }
                    : selectedSize && selectedColor
                    ? { backgroundColor: '#22c55e' }
                    : undefined
                }
              >
                {addedToCart ? (
                  <>
                    <Check size={18} />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>

              <Link
                to={`/provador?product=${product.id}`}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm border border-white/15 text-gray-300 hover:border-[#F0B429]/50 hover:text-white transition-all hover:bg-[#1E1E1E]"
              >
                <Sparkles size={16} style={{ color: '#F0B429' }} />
                Provar com IA
              </Link>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-white font-bold text-sm mb-2">Descrição</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#161616] border border-white/10 text-gray-500 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-white font-black text-2xl mb-6">Você também pode gostar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size guide modal */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-[#161616] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-lg">Guia de Tamanhos</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-400 font-medium">Tamanho</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Peito</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Cintura</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Quadril</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(sizeGuide) as [Size, typeof sizeGuide.PP][]).map(([size, measures]) => (
                    <tr key={size} className="border-b border-white/5">
                      <td
                        className="py-2.5 font-black"
                        style={{ color: selectedSize === size ? '#F0B429' : 'white' }}
                      >
                        {size}
                      </td>
                      <td className="py-2.5 text-gray-400">{measures.bust}</td>
                      <td className="py-2.5 text-gray-400">{measures.waist}</td>
                      <td className="py-2.5 text-gray-400">{measures.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-xs mt-4">
              Em caso de dúvidas, use o Provador IA para uma recomendação personalizada.
            </p>
            <Link
              to={`/provador?product=${product.id}`}
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#F0B429' }}
              onClick={() => setShowSizeGuide(false)}
            >
              <Sparkles size={14} />
              Usar Provador IA
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
