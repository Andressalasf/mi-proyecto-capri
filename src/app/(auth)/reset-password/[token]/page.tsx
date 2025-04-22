"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  // Verificar si el token es válido
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/reset-password/verify/${token}`)
        setTokenValid(true)
      } catch (error) {
        console.error("Error al verificar token:", error)
        setTokenValid(false)
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      // Llamar al endpoint para actualizar la contraseña
      const response = await axios.post(`http://localhost:4000/api/reset-password/reset`, {
        token,
        password
      })
      
      console.log("Respuesta del servidor:", response.data)
      setSuccess(true)
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login?passwordReset=true")
      }, 3000)
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status
        
        if (status === 400) {
          setError("El enlace de restablecimiento es inválido o ha expirado.")
        } else {
          setError(error.response.data.message || "Ocurrió un error al procesar su solicitud.")
        }
      } else {
        setError("Ocurrió un error inesperado. Por favor intente nuevamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar un mensaje de carga mientras se verifica el token
  if (tokenValid === null) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-[#e8f0d8] shadow-xl">
        <div className="p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold text-[#1a2e02]">Verificando enlace...</h2>
          <p className="text-sm text-[#1a2e02]/80">Por favor espere mientras verificamos su enlace de recuperación</p>
        </div>
      </div>
    )
  }

  // Mostrar un mensaje de error si el token no es válido
  if (tokenValid === false) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-[#e8f0d8] shadow-xl">
        <div className="p-8">
          <h2 className="mb-4 text-center text-xl font-semibold text-[#1a2e02]">Enlace inválido</h2>
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-500">
            El enlace de restablecimiento es inválido o ha expirado. Por favor solicite un nuevo enlace.
          </div>
          <Link href="/forgot-password">
            <Button className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]">
              Solicitar nuevo enlace
            </Button>
          </Link>
        </div>
      </div>
    )
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

        <h2 className="mb-6 text-center text-xl font-semibold text-[#1a2e02]">
          Restablecer Contraseña
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
              Su contraseña ha sido restablecida exitosamente. Será redirigido a la página de inicio de sesión.
            </div>
            <Link href="/login">
              <Button className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ir al inicio de sesión
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[#1a2e02]">
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su nueva contraseña"
                  className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
                  disabled={isLoading}
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
            <div>
              <Label htmlFor="confirm-password" className="text-sm font-medium text-[#1a2e02]">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme su nueva contraseña"
                  className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]"
            >
              {isLoading ? "RESTABLECIENDO..." : "RESTABLECER CONTRASEÑA"}
            </Button>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="font-medium text-[#6b7c45] hover:underline">
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 