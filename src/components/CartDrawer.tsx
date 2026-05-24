import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../store/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const buildWhatsAppMessage = () => {
    const lines = [
      '🛍️ *Olá! Gostaria de fazer um pedido no DNZ Outlet:*\n',
      ...items.map(
        (item, i) =>
          `${i + 1}. *${item.product.name}*\n   Tamanho: ${item.size} | Cor: ${item.color.name}\n   Qtd: ${item.quantity} x ${formatPrice(item.product.price)}`
      ),
      `\n💰 *Total: ${formatPrice(total)}*`,
      '\n📍 Boituva - SP',
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const openWhatsApp = () => {
    const number = '5515999999999';
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0F0F0F] border-l border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: '#F0B429' }} />
            <h2 className="text-white font-bold text-base">
              Carrinho
              {itemCount > 0 && (
                <span
                  className="ml-2 text-xs font-black text-black px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#F0B429' }}
                >
                  {itemCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E1E] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#161616' }}
              >
                <ShoppingBag size={36} className="text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-medium">Seu carrinho está vazio</p>
                <p className="text-gray-600 text-sm mt-1">Adicione produtos para continuar</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color.name}`}
                className="flex gap-3 bg-[#161616] rounded-xl p-3 border border-white/5"
              >
                {/* Image */}
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E1E1E]">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <h4 className="text-white text-xs font-semibold line-clamp-2 leading-snug">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                    <span className="bg-[#1E1E1E] px-1.5 py-0.5 rounded font-medium text-gray-400">
                      {item.size}
                    </span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span>{item.color.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 bg-[#1E1E1E] rounded-lg p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color.name, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-white text-xs font-bold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color.name, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price + remove */}
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-black">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color.name)}
                        className="text-gray-600 hover:text-red-400 transition-colors p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Subtotal</span>
              <span className="text-white font-black text-xl">{formatPrice(total)}</span>
            </div>
            <p className="text-gray-600 text-xs text-center">
              Frete calculado no WhatsApp · Entregamos para todo o Brasil
            </p>

            {/* CTA */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} />
              Finalizar via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
