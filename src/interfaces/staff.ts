// Interfaces para empleados
export interface Staff {
  id: number;
  staff_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  dni: string;
  salary?: number;
  year_experience?: string;
  specialization?: string;
  period?: Date;
  degree?: string;
  staff_type: 'ADMINISTRATIVO' | 'PRACTICANTE';
  manager_id?: string;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  manager?: {
    staff_id: string;
    first_name: string;
    last_name: string;
  };
}

// Interface para crear un nuevo empleado
export interface CreateStaffData {
  staff_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  dni: string;
  salary?: number;
  year_experience?: string;
  specialization?: string;
  period?: Date;
  degree?: string;
  staff_type: 'ADMINISTRATIVO' | 'PRACTICANTE';
  manager_id?: string;
}

// Interface para actualizar un empleado
export interface UpdateStaffData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  salary?: number;
  year_experience?: string;
  specialization?: string;
  period?: Date;
  degree?: string;
  staff_type: 'ADMINISTRATIVO' | 'PRACTICANTE';
  manager_id?: string;
}

// Interfaces para respuestas de la API
export interface StaffApiResponse {
  staff: Staff[];
}

export interface SingleStaffApiResponse {
  staff: Staff;
}

export interface StaffCreateResponse {
  message: string;
  staff: Staff;
} 