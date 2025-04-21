"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginUser, registerUser } from "../services/api"

// Tipos
interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, code: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  code: string
  first_name: string
  last_name: string
  surname: string
  phone: string
  email: string
  password: string
}

// Crear el contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

// Hook personalizado para usar el contexto
export function useAuth() {
  return useContext(AuthContext)
}

// Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email: string, password: string, code: string) {
    setLoading(true)
    try {
      const userData = await loginUser({ email, password, code })
      
      // Guardar información del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      
      // Actualizar estado
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name
      })
      
      // Redirigir al dashboard
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Error desconocido durante el inicio de sesión")
    } finally {
      setLoading(false)
    }
  }

  async function register(userData: RegisterData) {
    setLoading(true)
    console.log("[AuthContext] Iniciando register...");
    console.log("[AuthContext] Datos recibidos:", { 
      ...userData, 
      password: '******' 
    });
    
    try {
      console.log("[AuthContext] Llamando a registerUser API...");
      const response = await registerUser(userData)
      console.log("[AuthContext] Respuesta de API recibida:", response);

      // Paso crítico: verificar si la respuesta es válida antes de proceder
      if (!response) { // Ajusta esta condición si esperas una estructura específica
        console.error("[AuthContext] La respuesta de la API no es válida o está vacía.");
        throw new Error("Respuesta inválida del servidor tras registro.");
      }

      console.log("[AuthContext] Guardando en localStorage...");
      localStorage.setItem("registered", "true");
      console.log("[AuthContext] Guardado en localStorage exitoso.");
      
      // Ya no redirigimos aquí, eso se maneja en el componente
      console.log("[AuthContext] Registro completado exitosamente.");
      
      return response; // Devolvemos la respuesta para que el componente sepa que fue exitoso
      
    } catch (error) {
      console.error("[AuthContext] Error CAPTURADO durante el proceso de registro:", error);
      // Asegurarnos de que el componente reciba el error
      if (error instanceof Error) {
        throw error; // Re-lanzar el error original
      } else {
        throw new Error("Ocurrió un error desconocido en AuthContext durante el registro.");
      }
    } finally {
      setLoading(false);
      console.log("[AuthContext] Finalizando register (bloque finally).");
    }
  }

  function logout() {
    localStorage.removeItem("user")
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
