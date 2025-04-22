"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"

// Constante para la URL de la API
const API_URL = "http://localhost:4000/api"

export default function LoginPage() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const passwordReset = searchParams.get("passwordReset")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Formulario de login enviado - Iniciando proceso de validación")
    
    // Limpiar estado anterior
    setError("")
    setIsLoading(true)
    
    try {
      // Validaciones básicas
      if (!code || !email || !password) {
        throw new Error("Todos los campos son obligatorios")
      }
      
      // Preparar datos para el login
      const loginData = {
        code,
        email,
        password
      }
      
      console.log("Datos preparados para enviar al backend:", {
        ...loginData,
        password: "******"
      })
      
      // Configurar la solicitud con headers explícitos
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      
      // Conexión directa con el backend
      console.log("Enviando solicitud POST directamente a:", `${API_URL}/login`)
      const response = await axios.post(`${API_URL}/login`, loginData, config)
      
      console.log("Respuesta del servidor:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })
      
      // Verificar respuesta exitosa
      if (response.status === 200 && response.data.user && response.data.token) {
        console.log("¡Login exitoso!")
        
        // Guardar datos del usuario en localStorage
        const userData = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          token: response.data.token
        }
        
        localStorage.setItem("user", JSON.stringify(userData))
        
        // Redirigir al dashboard
        console.log("Redirigiendo al dashboard...")
        router.push("/dashboard")
      } else {
        console.warn("Respuesta inesperada del servidor:", response)
        throw new Error("Respuesta inesperada del servidor")
      }
      
    } catch (error) {
      console.error("Error en el proceso de login:", error)
      
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          console.error("No hay respuesta del servidor - Verifica que el backend esté corriendo")
          setError("No se puede conectar con el servidor. Verifica que el backend esté corriendo.")
        } else {
          console.error("Detalles del error del servidor:", {
            status: error.response.status,
            data: error.response.data
          })
          
          // Mensajes de error específicos
          switch (error.response.status) {
            case 400:
              setError("Datos de inicio de sesión inválidos. Por favor verifica la información.")
              break
            case 401:
              setError("Contraseña incorrecta. Por favor intenta de nuevo.")
              break
            case 404:
              setError("Usuario no encontrado. Verifica el email y código proporcionados.")
              break
            case 500:
              setError("Error interno del servidor. Por favor intenta más tarde.")
              break
            default:
              setError(error.response.data.message || "Error al iniciar sesión")
          }
        }
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Ha ocurrido un error inesperado durante el inicio de sesión")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-[#e8f0d8] shadow-xl">
      <div className="p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-3 rounded-full bg-[#d3dbb8] px-6 py-3">
            <div className="text-[#6b7c45]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 17c.6.6 1 1.4 1 2.3V20H6v-.7c0-.9.4-1.7 1-2.3" />
                <path d="M8 14v-5" />
                <path d="M16 9v5" />
                <path d="M13 3c.5 0 1 .2 1.4.6A2 2 0 0 1 15 5v1h-3V5c0-.5.2-1 .6-1.4.4-.4.9-.6 1.4-.6z" />
                <path d="M18 5V4c0-.5-.2-1-.6-1.4A2 2 0 0 0 16 2h-1.5" />
                <path d="M10 3H8.5c-.5 0-1 .2-1.4.6A2 2 0 0 0 6 5v4c0 1.1.9 2 2 2h1" />
                <path d="M15 11h1c1.1 0 2-.9 2-2V7.5" />
                <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#6b7c45]">Granme</h1>
          </div>
        </div>

        <h2 className="mb-6 text-center text-xl font-semibold text-[#1a2e02]">Iniciar sesión</h2>

        {registered && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
            Registro exitoso. Ahora puedes iniciar sesión con tus credenciales.
          </div>
        )}
        
        {passwordReset && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
            Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="codigo" className="text-sm font-medium text-[#1a2e02]">
              Código
            </Label>
            <Input
              id="codigo"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingrese su código"
              className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-[#1a2e02]">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-[#1a2e02]">
                Contraseña
              </Label>
              <Link href="/forgot-password" className="text-xs font-medium text-[#6b7c45] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]">
            {isLoading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-[#1a2e02]">¿No tienes cuenta? </span>
            <Link href="/register" className="font-medium text-[#6b7c45] hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

