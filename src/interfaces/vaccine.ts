import { Goat } from './goat';

export interface Vaccine {
  id: number;
  goat_id: number;
  name: string;
  dose: number;
  unit: string;
  application_date: string;
  createdAt?: string;
  updatedAt?: string;
  goat?: Pick<Goat, 'id' | 'goat_id' | 'name'>;
}

export interface CreateVaccineData {
  goat_id: number;
  name: string;
  dose: number;
  unit: string;
  application_date: string;
} 