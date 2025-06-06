import { Product } from './product';
import { Staff } from './staff';

export interface Output {
  id: number;
  product_id: string;
  employee_id: string;
  quantity: number;
  output_date: string;
  createdAt?: string;
  updatedAt?: string;
  product?: Pick<Product, 'product_id' | 'name' | 'unit'>;
  employee?: Pick<Staff, 'staff_id' | 'first_name' | 'last_name'>;
}

export interface CreateOutputData {
  product_id: string;
  employee_id: string;
  quantity: number;
  output_date: string;
} 