// src/lib/api.ts
import axios from "axios";
import { CreateGoatData, UpdateGoatData, Goat } from '@/interfaces/goat';

// Configuración global de axios
const API_URL = "http://localhost:4000/api";

console.log("API URL configurada:", API_URL);

// Añadir timeout más largo para peticiones que pueden tardar
axios.defaults.timeout = 15000; // 15 segundos

// Configurar interceptores y manejo de errores global
axios.interceptors.request.use(
  config => {
    console.log(`[API] Enviando ${config.method?.toUpperCase()} a ${config.url}`);
    return config;
  },
  error => {
    console.error('[API] Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log(`[API] Respuesta recibida de ${response.config.url} con estado ${response.status}`);
    return response;
  },
  error => {
    if (axios.isAxiosError(error)) {
      const errorInfo = {
        url: error.config?.url || 'desconocida',
        status: error.response?.status || 'sin respuesta',
        message: error.response?.data?.message || error.message || 'Error desconocido'
      };
      console.error('[API] Error de respuesta:', errorInfo);
      
      // Si el error es por tiempo de espera
      if (error.code === 'ECONNABORTED') {
        console.error('[API] Tiempo de espera agotado. Verifica que el servidor backend esté funcionando correctamente.');
      }
      
      // Si el error es por no poder conectar con el servidor
      if (error.code === 'ERR_NETWORK') {
        console.error('[API] Error de red. Verifica que el servidor backend esté en ejecución en http://localhost:4000');
      }
    } else {
      console.error('[API] Error no Axios:', error);
    }
    return Promise.reject(error);
  }
);

// Interface para register
export interface RegisterData {
  code: string;
  first_name: string;
  last_name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
}

// Interface para login
export interface LoginData {
  email: string;
  password: string;
  code: string;
}

// Interface para respuesta de usuario
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

// Interfaces para el perfil de usuario
export interface ProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface UserProfileResponse {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  surname: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

// Funciones para proveedores
import { 
  Supplier, 
  SupplierApiResponse, 
  SingleSupplierApiResponse, 
  CreateSupplierData, 
  UpdateSupplierData, 
  SupplierCreateResponse 
} from '../interfaces/supplier';

import {
  Country,
  State,
  City,
  CountryApiResponse,
  StateApiResponse,
  CityApiResponse
} from '../interfaces/location';

// Obtener todos los proveedores
export async function getAllSuppliers(): Promise<Supplier[]> {
  try {
    console.log('[API] Obteniendo lista de proveedores desde:', `${API_URL}/suppliers`);
    
    const response = await axios.get<SupplierApiResponse>(`${API_URL}/suppliers`);
    
    if (response.status === 200 && response.data.suppliers) {
      console.log('[API] Proveedores obtenidos con éxito:', response.data.suppliers.length);
      return response.data.suppliers;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener proveedores:', error);
    
    // Manejo específico para errores de conexión
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener proveedores');
      }
    }
    
    // Si es otro tipo de error
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Obtener un proveedor por ID
export async function getSupplierById(id: number): Promise<Supplier> {
  try {
    console.log(`Obteniendo proveedor con ID: ${id}`);
    
    const response = await axios.get<SingleSupplierApiResponse>(`${API_URL}/suppliers/${id}`);
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (response.status === 200 && response.data.supplier) {
      return response.data.supplier;
    } else {
      console.error('Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Proveedor no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al obtener proveedor');
      }
    }
    throw error;
  }
}

// Crear un nuevo proveedor
export async function createSupplier(supplierData: CreateSupplierData): Promise<Supplier> {
  try {
    console.log('[API] Creando nuevo proveedor con datos:', {
      ...supplierData
    });
    
    const response = await axios.post<SupplierCreateResponse>(`${API_URL}/suppliers`, supplierData);
    
    if (response.status === 201 && response.data.supplier) {
      console.log('[API] Proveedor creado con éxito:', response.data.supplier);
      return response.data.supplier;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al crear proveedor:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        throw new Error('Ya existe un proveedor con ese ID o NIT');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de proveedor inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al crear proveedor');
      }
    }
    throw error;
  }
}

// Actualizar un proveedor
export async function updateSupplier(id: number, supplierData: UpdateSupplierData): Promise<Supplier> {
  try {
    console.log(`[API] Actualizando proveedor con ID ${id} con datos:`, {
      ...supplierData
    });
    
    const response = await axios.put<SingleSupplierApiResponse>(`${API_URL}/suppliers/${id}`, supplierData);
    
    if (response.status === 200 && response.data.supplier) {
      console.log('[API] Proveedor actualizado con éxito:', response.data.supplier);
      return response.data.supplier;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al actualizar proveedor:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Proveedor no encontrado');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de proveedor inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al actualizar proveedor');
      }
    }
    throw error;
  }
}

// Eliminar un proveedor
export async function deleteSupplier(id: number): Promise<void> {
  try {
    console.log(`[API] Eliminando proveedor con ID: ${id}`);
    
    const response = await axios.delete<{ message: string }>(`${API_URL}/suppliers/${id}`);
    
    if (response.status !== 200) {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
    
    console.log('[API] Proveedor eliminado con éxito');
  } catch (error) {
    console.error('[API] Error al eliminar proveedor:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Proveedor no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al eliminar proveedor');
      }
    }
    throw error;
  }
}

// Funciones para ubicaciones

// Obtener todos los países
export async function getAllCountries(): Promise<Country[]> {
  try {
    console.log('[API] Obteniendo lista de países desde:', `${API_URL}/countries`);
    
    const response = await axios.get<CountryApiResponse>(`${API_URL}/countries`);
    
    if (response.status === 200 && response.data.countries) {
      console.log('[API] Países obtenidos con éxito:', response.data.countries.length);
      return response.data.countries;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener países:', error);
    
    // Manejo específico para errores de conexión
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener países');
      }
    }
    
    // Si es otro tipo de error
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Obtener todos los estados
export async function getAllStates(): Promise<State[]> {
  try {
    console.log('Obteniendo lista de estados/departamentos');
    
    const response = await axios.get<StateApiResponse>(`${API_URL}/states`);
    
    console.log('Respuesta de estados:', response.status, response.statusText);
    
    if (response.status === 200 && response.data.states) {
      return response.data.states;
    } else {
      console.error('Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al obtener estados:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener estados');
    }
    throw error;
  }
}

// Obtener estados por país
export async function getStatesByCountry(countryId: string): Promise<State[]> {
  try {
    console.log(`[API] Obteniendo estados/departamentos del país: ${countryId}`);
    
    const response = await axios.get<StateApiResponse>(`${API_URL}/countries/${countryId}/states`);
    
    if (response.status === 200 && response.data.states) {
      console.log('[API] Estados obtenidos con éxito:', response.data.states.length);
      return response.data.states;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener estados por país:', error);
    
    // Manejo específico para errores de conexión
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener estados por país');
      }
    }
    
    // Si es otro tipo de error
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Obtener todas las ciudades
export async function getAllCities(): Promise<City[]> {
  try {
    console.log('Obteniendo lista de ciudades');
    
    const response = await axios.get<CityApiResponse>(`${API_URL}/cities`);
    
    console.log('Respuesta de ciudades:', response.status, response.statusText);
    
    if (response.status === 200 && response.data.cities) {
      return response.data.cities;
    } else {
      console.error('Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener ciudades');
    }
    throw error;
  }
}

// Obtener ciudades por estado
export async function getCitiesByState(stateId: string): Promise<City[]> {
  try {
    console.log(`[API] Obteniendo ciudades del estado/departamento: ${stateId}`);
    
    const response = await axios.get<CityApiResponse>(`${API_URL}/states/${stateId}/cities`);
    
    if (response.status === 200 && response.data.cities) {
      console.log('[API] Ciudades obtenidas con éxito:', response.data.cities.length);
      return response.data.cities;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener ciudades por estado:', error);
    
    // Manejo específico para errores de conexión
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener ciudades por estado');
      }
    }
    
    // Si es otro tipo de error
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Registrar usuario
export const registerUser = async (userData: RegisterData) => {
  try {
    console.log('[API] Intentando conectar con el backend en:', API_URL);
    console.log('[API] Datos a enviar (sin password):', {
      ...userData,
      password: '********'
    });

    // Asegurarse de que la URL del endpoint es correcta
    const registerUrl = `${API_URL}/register`;
    console.log('[API] Enviando solicitud POST a:', registerUrl);
    
    // Configurar la solicitud con headers explícitos
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    // Enviar la solicitud POST
    console.log('[API] Enviando solicitud...');
    const response = await axios.post(registerUrl, userData, config);
    console.log('[API] Respuesta recibida del servidor');
    
    console.log('[API] Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    // Verificar que la respuesta contiene los datos esperados
    if (!response.data) {
      console.error('[API] La respuesta del servidor no contiene datos');
      throw new Error('Respuesta inválida del servidor');
    }
    
    // Verificar si la respuesta contiene un mensaje de éxito
    if (response.status === 201 && response.data.message === 'Usuario registrado exitosamente') {
      console.log('[API] Registro exitoso confirmado por el servidor');
    } else {
      console.warn('[API] Respuesta inesperada del servidor:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('[API] Error detallado en el registro:', error);
    
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error('[API] No hay respuesta del servidor - Verifica que el backend esté corriendo');
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo.');
      }
      
      console.error('[API] Detalles del error del servidor:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Mensajes de error más específicos basados en el código de estado
      switch (error.response.status) {
        case 400:
          throw new Error('Datos de registro inválidos. Por favor verifica la información.');
        case 409:
          throw new Error('El usuario ya existe. Por favor intenta con otro correo electrónico.');
        case 500:
          throw new Error('Error interno del servidor. Por favor intenta más tarde.');
        default:
          throw new Error(error.response.data.message || 'Error en el registro');
      }
    }
    
    throw new Error('Error inesperado durante el registro');
  }
};

// Login usuario
export const loginUser = async (loginData: LoginData): Promise<UserResponse> => {
  try {
    console.log(`Enviando solicitud de login a ${API_URL}/login con datos:`, {
      ...loginData,
      password: '********' // Ocultar contraseña en logs
    });
    
    const response = await axios.post(`${API_URL}/login`, loginData);
    console.log('Respuesta de login:', response.status, response.statusText);
    
    const { user, token } = response.data;
    
    if (!user || !token) {
      console.error('Respuesta del servidor no contiene usuario o token:', response.data);
      throw new Error("Formato de respuesta inválido del servidor");
    }
    
    // Asegurarse de que tenemos todos los datos necesarios
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token
    };
  } catch (error) {
    console.error('Error en loginUser:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Respuesta de error del servidor:', error.response.status, error.response.data);
      throw new Error(error.response.data.message || "Error en el inicio de sesión");
    }
    throw new Error("Error al conectar con el servidor");
  }
};

// Actualizar correo electrónico
export async function updateEmail(userId: number, currentEmail: string, newEmail: string, password: string) {
  try {
    console.log(`Enviando solicitud para actualizar correo: ${currentEmail} -> ${newEmail}`);
    
    const response = await axios.post(`${API_URL}/update-email`, {
      userId, 
      currentEmail, 
      newEmail,
      password
    });
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (response.status === 200 && response.data.user && response.data.token) {
      // Actualizar información en localStorage
      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } else {
      console.error('Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al actualizar correo electrónico:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'El correo electrónico ya está registrado por otro usuario');
      } else if (error.response.status === 401) {
        throw new Error('Contraseña incorrecta');
      } else if (error.response.status === 404) {
        throw new Error('Usuario no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al actualizar correo electrónico');
      }
    }
    throw error;
  }
}

// Obtener perfil de usuario
export async function getUserProfile(userId: number): Promise<UserProfileResponse> {
  try {
    console.log(`Obteniendo perfil del usuario con ID: ${userId}`);
    
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (response.status === 200 && response.data.user) {
      return response.data.user;
    } else {
      console.error('Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Usuario no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al obtener perfil de usuario');
      }
    }
    throw error;
  }
}

// Actualizar perfil de usuario
export async function updateUserProfile(userId: number, profileData: ProfileData) {
  try {
    // Verificación del userId
    if (!userId || isNaN(Number(userId))) {
      console.error('ID de usuario inválido:', userId);
      throw new Error('ID de usuario inválido');
    }

    // Verificar que existen los campos obligatorios
    if (!profileData.firstName || !profileData.lastName) {
      console.error('Datos de perfil incompletos:', profileData);
      throw new Error('El nombre y apellido son obligatorios');
    }
    
    // Verificar si el avatar en base64 es demasiado grande
    if (profileData.avatar) {
      const sizeInMB = profileData.avatar.length / 1024 / 1024;
      console.log(`Tamaño de imagen en Base64: ${sizeInMB.toFixed(2)}MB`);
      
      if (profileData.avatar.length > 1024 * 1024 * 2) { // Reducido a 2MB en base64 (aproximadamente 1.5MB de imagen real)
        throw new Error('La imagen es demasiado grande. Por favor utiliza una imagen más pequeña (máximo 1MB).');
      }
    }
    
    console.log(`Enviando solicitud para actualizar perfil del usuario ${userId} con datos:`, {
      ...profileData,
      avatar: profileData.avatar ? `[Base64 imagen: ${Math.round(profileData.avatar.length / 1024)}KB]` : undefined
    });
    
    // Configurar timeout más largo para subidas de imágenes
    const config = {
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const response = await axios.post(`${API_URL}/update-profile`, {
      userId,
      ...profileData
    }, config);
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (response.status === 200 && response.data.user && response.data.token) {
      // Actualizar información en localStorage
      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.token,
        phone: response.data.user.phone,
        avatar: response.data.user.avatar
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } else {
      console.error('Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    
    // Detectar errores específicos
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Timeout alcanzado al intentar actualizar el perfil');
        throw new Error('La solicitud tardó demasiado tiempo. Intenta con una imagen más pequeña.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        console.error('Error de red al actualizar perfil');
        throw new Error('Error de conexión con el servidor. Verifica tu conexión a internet.');
      }
      
      if (error.response) {
        console.error('Respuesta de error del servidor:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        
        if (error.response.status === 413) {
          throw new Error('La imagen es demasiado grande para el servidor. Por favor utiliza una imagen más pequeña o de menor resolución.');
        } else if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Datos de perfil inválidos');
        } else if (error.response.status === 404) {
          throw new Error('Usuario no encontrado');
        } else if (error.response.status === 500) {
          throw new Error('Error interno del servidor. Posiblemente la imagen es demasiado grande o tiene un formato no soportado.');
        } else {
          throw new Error(error.response.data.message || 'Error al actualizar perfil de usuario');
        }
      }
    }
    
    // Si es un error que ya hemos lanzado nosotros (como el de tamaño de imagen)
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error al actualizar perfil de usuario');
  }
}

// Subir imagen de perfil (usando Base64)
export async function uploadProfileImage(file: File): Promise<string> {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }
    
    // Validar tamaño del archivo
    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > 1) {
      throw new Error(`La imagen es demasiado grande (${fileSizeInMB.toFixed(2)}MB). Máximo permitido: 1MB`);
    }
    
    console.log(`Convirtiendo imagen a base64: ${file.name}, tipo: ${file.type}, tamaño: ${fileSizeInMB.toFixed(2)}MB`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // Retornar el string en base64
          const base64String = event.target.result as string;
          
          // Verificar tamaño del string base64
          const base64SizeInMB = base64String.length / 1024 / 1024;
          console.log(`Tamaño de la imagen en base64: ${base64SizeInMB.toFixed(2)}MB`);
          
          if (base64SizeInMB > 2) {
            reject(new Error(`La imagen codificada es demasiado grande (${base64SizeInMB.toFixed(2)}MB). Intenta con una imagen más pequeña.`));
            return;
          }
          
          resolve(base64String);
        } else {
          reject(new Error('Error al leer el archivo'));
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error al leer el archivo para convertir a base64:', error);
        reject(new Error('Error al procesar el archivo'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error en uploadProfileImage:', error);
    throw error;
  }
}

// Funciones para empleados
import { 
  Staff, 
  StaffApiResponse, 
  SingleStaffApiResponse, 
  CreateStaffData, 
  UpdateStaffData, 
  StaffCreateResponse 
} from '../interfaces/staff';

// Obtener todos los empleados
export async function getAllStaff(): Promise<Staff[]> {
  try {
    console.log('[API] Obteniendo lista de empleados desde:', `${API_URL}/staff`);
    
    const response = await axios.get<StaffApiResponse>(`${API_URL}/staff`);
    
    if (response.status === 200 && response.data.staff) {
      console.log('[API] Empleados obtenidos con éxito:', response.data.staff.length);
      return response.data.staff;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener empleados:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener empleados');
      }
    }
    
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Obtener un empleado por ID
export async function getStaffById(id: number): Promise<Staff> {
  try {
    console.log(`[API] Obteniendo empleado con ID: ${id}`);
    
    const response = await axios.get<SingleStaffApiResponse>(`${API_URL}/staff/${id}`);
    
    if (response.status === 200 && response.data.staff) {
      return response.data.staff;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener empleado:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Empleado no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al obtener empleado');
      }
    }
    throw error;
  }
}

// Crear un nuevo empleado
export async function createStaff(staffData: CreateStaffData): Promise<Staff> {
  try {
    console.log('[API] Creando nuevo empleado con datos:', {
      ...staffData
    });
    
    const response = await axios.post<StaffCreateResponse>(`${API_URL}/staff`, staffData);
    
    if (response.status === 201 && response.data.staff) {
      console.log('[API] Empleado creado con éxito:', response.data.staff);
      return response.data.staff;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al crear empleado:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        throw new Error('Ya existe un empleado con ese ID o DNI');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de empleado inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al crear empleado');
      }
    }
    throw error;
  }
}

// Actualizar un empleado
export async function updateStaff(id: number, staffData: UpdateStaffData): Promise<Staff> {
  try {
    console.log(`[API] Actualizando empleado con ID ${id} con datos:`, {
      ...staffData
    });
    
    const response = await axios.put<SingleStaffApiResponse>(`${API_URL}/staff/${id}`, staffData);
    
    if (response.status === 200 && response.data.staff) {
      console.log('[API] Empleado actualizado con éxito:', response.data.staff);
      return response.data.staff;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al actualizar empleado:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Empleado no encontrado');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de empleado inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al actualizar empleado');
      }
    }
    throw error;
  }
}

// Eliminar un empleado
export async function deleteStaff(id: number): Promise<void> {
  try {
    console.log(`[API] Eliminando empleado con ID: ${id}`);
    
    const response = await axios.delete<{ message: string }>(`${API_URL}/staff/${id}`);
    
    if (response.status !== 200) {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
    
    console.log('[API] Empleado eliminado con éxito');
  } catch (error) {
    console.error('[API] Error al eliminar empleado:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Empleado no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al eliminar empleado');
      }
    }
    throw error;
  }
}

// Funciones para productos
import { 
  Product, 
  ProductApiResponse, 
  SingleProductApiResponse, 
  CreateProductData, 
  UpdateProductData, 
  ProductCreateResponse,
  UpdateStockData
} from '../interfaces/product';

// Obtener todos los productos
export async function getAllProducts(): Promise<Product[]> {
  try {
    console.log('[API] Obteniendo lista de productos desde:', `${API_URL}/products`);
    
    const response = await axios.get<ProductApiResponse>(`${API_URL}/products`);
    
    if (response.status === 200 && response.data.products) {
      console.log('[API] Productos obtenidos con éxito:', response.data.products.length);
      return response.data.products;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener productos:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener productos');
      }
    }
    
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Obtener un producto por ID
export async function getProductById(id: number): Promise<Product> {
  try {
    console.log(`[API] Obteniendo producto con ID: ${id}`);
    
    const response = await axios.get<SingleProductApiResponse>(`${API_URL}/products/${id}`);
    
    if (response.status === 200 && response.data.product) {
      return response.data.product;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener producto:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Producto no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al obtener producto');
      }
    }
    throw error;
  }
}

// Crear un nuevo producto
export async function createProduct(productData: CreateProductData): Promise<Product> {
  try {
    console.log('[API] Creando nuevo producto con datos:', {
      ...productData
    });
    
    const response = await axios.post<ProductCreateResponse>(`${API_URL}/products`, productData);
    
    if (response.status === 201 && response.data.product) {
      console.log('[API] Producto creado con éxito:', response.data.product);
      return response.data.product;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al crear producto:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        throw new Error('Ya existe un producto con ese ID');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de producto inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al crear producto');
      }
    }
    throw error;
  }
}

// Actualizar un producto
export async function updateProduct(id: number, productData: UpdateProductData): Promise<Product> {
  try {
    console.log(`[API] Actualizando producto con ID ${id} con datos:`, {
      ...productData
    });
    
    const response = await axios.put<SingleProductApiResponse>(`${API_URL}/products/${id}`, productData);
    
    if (response.status === 200 && response.data.product) {
      console.log('[API] Producto actualizado con éxito:', response.data.product);
      return response.data.product;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al actualizar producto:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Producto no encontrado');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de producto inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al actualizar producto');
      }
    }
    throw error;
  }
}

// Eliminar un producto
export async function deleteProduct(id: number): Promise<void> {
  try {
    console.log(`[API] Eliminando producto con ID: ${id}`);
    
    const response = await axios.delete<{ message: string }>(`${API_URL}/products/${id}`);
    
    if (response.status !== 200) {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
    
    console.log('[API] Producto eliminado con éxito');
  } catch (error) {
    console.error('[API] Error al eliminar producto:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Producto no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al eliminar producto');
      }
    }
    throw error;
  }
}

// Actualizar stock de un producto
export async function updateProductStock(id: number, stockData: UpdateStockData): Promise<Product> {
  try {
    console.log(`[API] Actualizando stock del producto con ID ${id}:`, stockData);
    
    const response = await axios.put<SingleProductApiResponse>(`${API_URL}/products/${id}/stock`, stockData);
    
    if (response.status === 200 && response.data.product) {
      console.log('[API] Stock actualizado con éxito:', response.data.product);
      return response.data.product;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al actualizar stock:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Producto no encontrado');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de stock inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al actualizar stock');
      }
    }
    throw error;
  }
}

// Obtener productos con stock bajo
export async function getLowStockProducts(): Promise<Product[]> {
  try {
    console.log('[API] Obteniendo productos con stock bajo desde:', `${API_URL}/products/low-stock`);
    
    const response = await axios.get<ProductApiResponse>(`${API_URL}/products/low-stock`);
    
    if (response.status === 200 && response.data.products) {
      console.log('[API] Productos con stock bajo obtenidos con éxito:', response.data.products.length);
      return response.data.products;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener productos con stock bajo:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener productos con stock bajo');
      }
    }
    
    throw new Error('Error al comunicarse con el servidor');
  }
}

// Funciones para caprinos
export async function getAllGoats(): Promise<Goat[]> {
  try {
    console.log('[API] Obteniendo lista de caprinos desde:', `${API_URL}/goats`);
    
    const response = await axios.get<{ goats: Goat[] }>(`${API_URL}/goats`);
    
    if (response.status === 200 && response.data.goats) {
      console.log('[API] Caprinos obtenidos con éxito:', response.data.goats.length);
      return response.data.goats;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener caprinos:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor tardó demasiado en responder. Verifica que el backend esté funcionando correctamente.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en http://localhost:4000.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener caprinos');
      }
    }
    
    throw new Error('Error al comunicarse con el servidor');
  }
}

export async function getGoatById(id: number): Promise<Goat> {
  try {
    console.log(`[API] Obteniendo caprino con ID: ${id}`);
    
    const response = await axios.get<{ goat: Goat }>(`${API_URL}/goats/${id}`);
    
    if (response.status === 200 && response.data.goat) {
      return response.data.goat;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al obtener caprino:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Caprino no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al obtener caprino');
      }
    }
    throw error;
  }
}

export async function createGoat(data: CreateGoatData): Promise<Goat> {
  try {
    console.log('[API] Creando nuevo caprino con datos:', {
      ...data
    });
    
    const response = await axios.post<{ goat: Goat }>(`${API_URL}/goats`, data);
    
    if (response.status === 201 && response.data.goat) {
      console.log('[API] Caprino creado con éxito:', response.data.goat);
      return response.data.goat;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al crear caprino:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        throw new Error('Ya existe un caprino con ese ID');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de caprino inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al crear caprino');
      }
    }
    throw error;
  }
}

export async function updateGoat(id: number, data: UpdateGoatData): Promise<Goat> {
  try {
    console.log(`[API] Actualizando caprino con ID ${id} con datos:`, {
      ...data
    });
    
    const response = await axios.put<{ goat: Goat }>(`${API_URL}/goats/${id}`, data);
    
    if (response.status === 200 && response.data.goat) {
      console.log('[API] Caprino actualizado con éxito:', response.data.goat);
      return response.data.goat;
    } else {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
  } catch (error) {
    console.error('[API] Error al actualizar caprino:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Caprino no encontrado');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Datos de caprino inválidos');
      } else {
        throw new Error(error.response.data.message || 'Error al actualizar caprino');
      }
    }
    throw error;
  }
}

export async function deleteGoat(id: number): Promise<void> {
  try {
    console.log(`[API] Eliminando caprino con ID: ${id}`);
    
    const response = await axios.delete<{ message: string }>(`${API_URL}/goats/${id}`);
    
    if (response.status !== 200) {
      console.error('[API] Respuesta inesperada del servidor:', response);
      throw new Error('Respuesta inesperada del servidor');
    }
    
    console.log('[API] Caprino eliminado con éxito');
  } catch (error) {
    console.error('[API] Error al eliminar caprino:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('Caprino no encontrado');
      } else {
        throw new Error(error.response.data.message || 'Error al eliminar caprino');
      }
    }
    throw error;
  }
}
