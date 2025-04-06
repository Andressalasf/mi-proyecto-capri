"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

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

  const { register } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setError("")
      setIsLoading(true)

      await register({
        code,
        firstName,
        lastName,
        surname,
        phone,
        email,
        password,
      })

      // Redirigir a la página de verificación o login
      router.push("/login?registered=true")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error al registrar usuario")
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

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

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

          <Button type="submit" disabled={isLoading} className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]">
            {isLoading ? "REGISTRANDO..." : "REGISTRARSE"}
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

