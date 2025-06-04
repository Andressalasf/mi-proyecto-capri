export interface Goat {
  id: number;
  goat_id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  breed: string;
  goat_type: 'REPRODUCTOR' | 'LECHERA' | 'CRIA';
  weight: number;
  milk_production: number;
  food_consumption: number;
  vaccinations_count: number;
  heat_periods: number;
  offspring_count: number;
  parent_id?: number;
  created_at?: string;
  updated_at?: string;
  parent?: Goat;
  offspring?: Goat[];
}

export interface CreateGoatData {
  goat_id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  breed: string;
  goat_type: 'REPRODUCTOR' | 'LECHERA' | 'CRIA';
  weight?: number;
  milk_production?: number;
  food_consumption?: number;
  vaccinations_count?: number;
  heat_periods?: number;
  offspring_count?: number;
  parent_id?: number;
}

export interface UpdateGoatData {
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  breed?: string;
  goat_type?: 'REPRODUCTOR' | 'LECHERA' | 'CRIA';
  weight?: number;
  milk_production?: number;
  food_consumption?: number;
  vaccinations_count?: number;
  heat_periods?: number;
  offspring_count?: number;
  parent_id?: number;
} 