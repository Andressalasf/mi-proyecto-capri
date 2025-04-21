"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

// Constante para la URL de la API
const API_URL = "http://localhost:4000/api"

export default function RegisterPage() {
  const [code, setCode] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [surname, setSurname] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado - Iniciando proceso de registro directo")
    
    // Limpiar estado anterior
    setError("")
    setIsLoading(true)
    
    try {
      // Validaciones básicas
      if (!code || !firstName || !lastName || !surname || !email || !password) {
        throw new Error("Todos los campos son obligatorios excepto teléfono")
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("El formato del correo electrónico no es válido")
      }
      
      // Validar longitud de contraseña
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }
      
      // Preparar datos exactamente como en el script de prueba exitoso
      const userData = {
        code,
        first_name: firstName,
        last_name: lastName,
        surname,
        phone: phone || "",
        email,
        password
      }
      
      console.log("Datos preparados para enviar al backend:", {
        ...userData,
        password: "******"
      })
      
      // Configurar la solicitud con headers explícitos
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      
      // Conexión directa con el backend, como en el script de prueba
      console.log("Enviando solicitud POST directamente a:", `${API_URL}/register`)
      const response = await axios.post(`${API_URL}/register`, userData, config)
      
      console.log("Respuesta del servidor:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })
      
      // Verificar respuesta exitosa
      if (response.status === 201) {
        console.log("¡Registro exitoso!")
        setRegistrationSuccess(true)
        
        // Limpiar el formulario
        setCode("")
        setFirstName("")
        setLastName("")
        setSurname("")
        setPhone("")
        setEmail("")
        setPassword("")
        
        // Almacenar el indicador de registro exitoso
        localStorage.setItem("registered", "true")
        
        // Redirigir después de mostrar el mensaje
        setTimeout(() => {
          console.log("Redirigiendo a login...")
          router.push("/login?registered=true")
        }, 2000)
      } else {
        console.warn("Respuesta inesperada del servidor:", response)
        throw new Error("Respuesta inesperada del servidor")
      }
      
    } catch (error) {
      console.error("Error en el proceso de registro:", error)
      
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
              setError("Datos de registro inválidos. Por favor verifica la información.")
              break
            case 409:
              setError("El usuario ya existe. Por favor intenta con otro correo electrónico.")
              break
            case 500:
              setError("Error interno del servidor. Por favor intenta más tarde.")
              break
            default:
              setError(error.response.data.message || "Error en el registro")
          }
        }
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Ha ocurrido un error inesperado durante el registro")
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

        <h2 className="mb-6 text-center text-xl font-semibold text-[#1a2e02]">Crear una cuenta</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        
        {registrationSuccess && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-500">
            ¡Registro exitoso! Redirigiendo a la página de inicio de sesión...
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primer-nombre" className="text-sm font-medium text-[#1a2e02]">
                Primer nombre
              </Label>
              <Input
                id="primer-nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Primer nombre"
                className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
                required
              />
            </div>
            <div>
              <Label htmlFor="segundo-nombre" className="text-sm font-medium text-[#1a2e02]">
                Segundo nombre
              </Label>
              <Input
                id="segundo-nombre"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Segundo nombre"
                className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="apellido" className="text-sm font-medium text-[#1a2e02]">
              Apellido
            </Label>
            <Input
              id="apellido"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Ingrese su apellido"
              className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
              required
            />
          </div>

          <div>
            <Label htmlFor="telefono" className="text-sm font-medium text-[#1a2e02]">
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingrese su teléfono"
              className="mt-1 bg-[#1a2e02] text-white placeholder:text-gray-400 focus-visible:ring-[#6b7c45]"
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
            <Label htmlFor="password" className="text-sm font-medium text-[#1a2e02]">
              Contraseña
            </Label>
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

          <Button 
            type="submit" 
            disabled={isLoading || registrationSuccess} 
            className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]"
          >
            {isLoading ? "REGISTRANDO..." : registrationSuccess ? "REGISTRO EXITOSO" : "REGISTRARSE"}
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-[#1a2e02]">¿Ya tienes cuenta? </span>
            <Link href="/login" className="font-medium text-[#6b7c45] hover:underline">
              Ingresa acá
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

