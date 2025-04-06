"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "../services/api"

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
  firstName: string
  lastName: string
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
      // Simula login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (
        (email !== "demo@example.com" || password !== "password" || code !== "DEMO123") &&
        (email !== "usuario@ejemplo.com" || password !== "password123" || code !== "ABC123")
      ) {
        throw new Error("Credenciales incorrectas")
      }

      const mockUser = {
        id: "1",
        email,
        name: email === "demo@example.com" ? "Usuario Demo" : "Usuario Ejemplo",
      }

      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
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
  try {
    // Convertir a formato que espera la API
    const formattedData = {
      code: userData.code,
      first_name: userData.firstName,
      last_name: userData.lastName,
      surname: userData.surname,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
    }

    const result = await registerUser(formattedData)

    localStorage.setItem("registered", "true")
    router.push("/login")
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Error desconocido durante el registro")
  } finally {
    setLoading(false)
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
