// Interfaces para proveedores
import { Country, State, City } from './location';

export interface Supplier {
  id: number;
  supplier_id: string;
  name: string;
  nit: string;
  email: string;
  phone?: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  country?: Country;
  state?: State;
  city?: City;
}

// Interface para crear un nuevo proveedor
export interface CreateSupplierData {
  supplier_id: string;
  name: string;
  nit: string;
  email: string;
  phone?: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address?: string;
}

// Interface para actualizar un proveedor
export interface UpdateSupplierData {
  name: string;
  email: string;
  phone?: string;
  country_id: string;
  state_id: string;
  city_id: string;
  address?: string;
}

// Interface para respuesta de la API
export interface SupplierApiResponse {
  suppliers: Supplier[];
}

export interface SingleSupplierApiResponse {
  supplier: Supplier;
}

export interface SupplierCreateResponse {
  message: string;
  supplier: Supplier;
} 