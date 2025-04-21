"use client"

import { Suspense, lazy } from "react"
import { Loader2 } from "lucide-react"

// Usar lazy loading para el componente pesado
const DashboardContent = lazy(() => import("@/components/ui/dashboard-content-optimized"))

// Componente de carga para mostrar mientras se carga el dashboard
function LoadingDashboard() {
  return (
    <div className="flex h-[75vh] w-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#6b7c45] mx-auto mb-4" />
        <p className="text-xl font-medium text-[#6b7c45]">Cargando dashboard...</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <DashboardContent />
    </Suspense>
  )
}


