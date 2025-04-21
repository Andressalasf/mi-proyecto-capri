"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

// Constante para configurar timeout
const AUTH_CHECK_TIMEOUT = 50 // ms

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar autenticación de usuario - versión optimizada
  useEffect(() => {
    let isMounted = true // Para evitar cambios de estado en componentes desmontados
    
    const checkAuth = () => {
      try {
        // Verificar si hay un usuario en el localStorage - acceso directo
        const user = localStorage.getItem("user")
        
        if (!user && isMounted) {
          // Redirigir si no hay usuario
          router.replace("/login")
          return
        }
        
        // Usuario está autenticado, permitir acceso
        if (isMounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        // Redirigir en caso de error
        if (isMounted) {
          router.replace("/login")
        }
      }
    }
    
    // Timeout mínimo para evitar problemas de hidratación
    const timeoutId = setTimeout(checkAuth, AUTH_CHECK_TIMEOUT)
    
    // Limpiar efecto al desmontar
    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [router])

  // Mostrar indicador de carga optimizado mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#e8f0d8]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#6b7c45] mx-auto mb-4" />
          <p className="text-xl font-medium text-[#6b7c45]">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Mostrar el layout completo una vez autenticado
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-[#e8f0d8] p-6 overflow-auto">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

