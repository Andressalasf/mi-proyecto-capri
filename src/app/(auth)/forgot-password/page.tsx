"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import axios from "axios"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !code) {
      setError("Por favor ingrese su correo electrónico y código de usuario")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      // Llamar al endpoint para solicitar recuperación de contraseña
      const response = await axios.post("http://localhost:4000/api/reset-password/request", {
        email,
        code
      })
      
      console.log("Respuesta del servidor:", response.data)
      
      // Redireccionar inmediatamente si recibimos el enlace
      if (response.data.resetUrl) {
        window.location.href = response.data.resetUrl;
      } else {
        // Caso poco probable: éxito pero sin URL (modo producción)
        setSuccess(true)
      }
    } catch (error: Error | unknown) {
      console.error("Error al solicitar recuperación:", error)
      
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("No se pudo conectar con el servidor. Verifique su conexión a internet.")
        } else {
          const status = error.response.status
          
          if (status === 404) {
            setError("No se encontró ninguna cuenta con este correo y código.")
          } else if (status === 429) {
            setError("Demasiados intentos. Por favor espere unos minutos e intente nuevamente.")
          } else {
            setError(error.response.data.message || "Ocurrió un error al procesar su solicitud.")
          }
        }
      } else {
        setError("Ocurrió un error inesperado. Por favor intente nuevamente.")
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

        <h2 className="mb-6 text-center text-xl font-semibold text-[#1a2e02]">
          Recuperar Contraseña
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
              Se ha enviado un enlace de recuperación a su correo electrónico. Por favor revise su bandeja de entrada.
            </div>
            <Link href="/login">
              <Button className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="codigo" className="text-sm font-medium text-[#1a2e02]">
                Código de usuario
              </Label>
              <Input
                id="codigo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingrese su código de usuario"
                className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
                disabled={isLoading}
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
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]"
            >
              {isLoading ? "ENVIANDO..." : "ENVIAR ENLACE DE RECUPERACIÓN"}
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