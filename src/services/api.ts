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
