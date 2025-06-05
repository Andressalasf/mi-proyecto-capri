export interface Sale {
  id: number;
  sale_id: string;
  user_id: string;
  client_id: string;
  product_type: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  date: string;
  payment_method: string;
  payment_status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSaleData {
  sale_id: string;
  user_id: string;
  client_id: string;
  product_type: string;
  quantity: number;
  unit: string;
  unit_price: number;
  date: string;
  payment_method: string;
  payment_status: string;
  notes: string;
}

export interface UpdateSaleData {
  user_id?: string;
  client_id?: string;
  product_type?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  date?: string;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
} 