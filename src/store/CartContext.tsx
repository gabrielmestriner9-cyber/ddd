import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, Size, Color } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: Size, color: Color, quantity?: number) => void;
  removeItem: (productId: string, size: Size, colorName: string) => void;
  updateQuantity: (productId: string, size: Size, colorName: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, size: Size, color: Color, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(
        item =>
          item.product.id === product.id &&
          item.size === size &&
          item.color.name === color.name
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id &&
          item.size === size &&
          item.color.name === color.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, color, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: Size, colorName: string) => {
    setItems(prev =>
      prev.filter(
        item =>
          !(item.product.id === productId && item.size === size && item.color.name === colorName)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: Size, colorName: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, colorName);
        return;
      }
      setItems(prev =>
        prev.map(item =>
          item.product.id === productId && item.size === size && item.color.name === colorName
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
