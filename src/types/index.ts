export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  sizes: Size[];
  colors: Color[];
  images: string[];
  description: string;
  tags: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
}

export type Category =
  | 'vestidos'
  | 'calcas'
  | 'blusas'
  | 'conjuntos'
  | 'saias'
  | 'shorts'
  | 'jaquetas'
  | 'acessorios';

export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';

export interface Color {
  name: string;
  hex: string;
}

export interface CartItem {
  product: Product;
  size: Size;
  color: Color;
  quantity: number;
}

export interface Measurements {
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
}

export interface FitResult {
  recommendedSize: Size;
  fitScore: number;
  notes: string[];
}
