// Interfaces para productos
import { Supplier } from './supplier';

export interface Product {
  id: number;
  product_id: string;
  name: string;
  category: 'Alimento' | 'Medicamento' | 'Suplemento' | 'Insumo' | 'Equipo' | 'Otro';
  unit: 'kg' | 'g' | 'L' | 'ml' | 'unidad' | 'dosis' | 'frasco';
  quantity: number;
  min_stock: number;
  price: number;
  location?: string;
  expiry_date?: string;
  supplier_id?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  supplier?: Supplier;
}

// Interface para crear un nuevo producto
export interface CreateProductData {
  product_id: string;
  name: string;
  category: 'Alimento' | 'Medicamento' | 'Suplemento' | 'Insumo' | 'Equipo' | 'Otro';
  unit: 'kg' | 'g' | 'L' | 'ml' | 'unidad' | 'dosis' | 'frasco';
  quantity?: number;
  min_stock?: number;
  price: number;
  location?: string;
  expiry_date?: string;
  supplier_id?: number;
  description?: string;
}

// Interface para actualizar un producto
export interface UpdateProductData {
  name?: string;
  category?: 'Alimento' | 'Medicamento' | 'Suplemento' | 'Insumo' | 'Equipo' | 'Otro';
  unit?: 'kg' | 'g' | 'L' | 'ml' | 'unidad' | 'dosis' | 'frasco';
  quantity?: number;
  min_stock?: number;
  price?: number;
  location?: string;
  expiry_date?: string;
  supplier_id?: number;
  description?: string;
}

// Interface para actualizar stock
export interface UpdateStockData {
  quantity: number;
  operation: 'add' | 'subtract';
}

// Interface para respuesta de la API
export interface ProductApiResponse {
  products: Product[];
}

export interface SingleProductApiResponse {
  product: Product;
}

export interface ProductCreateResponse {
  message: string;
  product: Product;
} 