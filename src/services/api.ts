// src/lib/api.ts
import axios from "axios";

const API_URL = "http://localhost:4000/api";

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
