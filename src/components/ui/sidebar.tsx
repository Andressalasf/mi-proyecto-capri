"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  FileText,
  Home,
  Package,
  ShoppingCart,
  Users,
  Truck,
  Milk,
  ChevronDown,
  ChevronRight,
  UserCog,
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    inventory: false,
    reports: false,
  })
  const [collapsed, setCollapsed] = useState(false)

  // Determinar qué menú debe estar abierto basado en la ruta actual
  useEffect(() => {
    if (pathname?.includes("/inventory")) {
      setOpenMenus((prev) => ({ ...prev, inventory: true }))
    }
    if (pathname?.includes("/reportes")) {
      setOpenMenus((prev) => ({ ...prev, reports: true }))
    }
  }, [pathname])

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "bg-[#1a2e02] text-white flex-shrink-0 hidden md:block transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h2 className="text-xl font-bold">Granme</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#2a4a04] hover:text-white"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            href="/"
            isActive={pathname === "/"}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Registro Caprino"
            href="/goats"
            isActive={pathname === "/goats"}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Truck className="h-5 w-5" />}
            label="Proveedores"
            href="/suppliers"
            isActive={pathname === "/suppliers"}
            collapsed={collapsed}
          />

          <NavItem
            icon={<UserCog className="h-5 w-5" />}
            label="Empleados"
            href="/employees"
            isActive={pathname === "/employees"}
            collapsed={collapsed}
          />

          {collapsed ? (
            <NavItem
              icon={<Package className="h-5 w-5" />}
              label="Inventario"
              href="/inventory"
              isActive={pathname === "/inventory"}
              collapsed={collapsed}
            />
          ) : (
            <Collapsible open={openMenus.inventory} onOpenChange={() => toggleMenu("inventory")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
                    openMenus.inventory && "bg-[#2a4a04]",
                  )}
                >
                  <Package className="mr-2 h-5 w-5" />
                  <span>Inventario</span>
                  {openMenus.inventory ? (
                    <ChevronDown className="ml-auto h-5 w-5" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <NavItem
                  icon={<ShoppingCart className="h-5 w-5" />}
                  label="Producto"
                  href="/inventory?tab=movements"
                  isActive={
                    pathname === "/inventory" && new URLSearchParams(window.location.search).get("tab") === "movements"
                  }
                  collapsed={collapsed}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {collapsed ? (
            <NavItem
              icon={<BarChart3 className="h-5 w-5" />}
              label="Reportes"
              href="/reportes"
              isActive={pathname === "/reportes"}
              collapsed={collapsed}
            />
          ) : (
            <Collapsible open={openMenus.reports} onOpenChange={() => toggleMenu("reports")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
                    openMenus.reports && "bg-[#2a4a04]",
                  )}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  <span>Reportes</span>
                  {openMenus.reports ? (
                    <ChevronDown className="ml-auto h-5 w-5" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <NavItem
                  icon={<FileText className="h-5 w-5" />}
                  label="Estadísticas"
                  href="/reportes?tab=statistics"
                  isActive={
                    pathname === "/reportes" && new URLSearchParams(window.location.search).get("tab") === "statistics"
                  }
                  collapsed={collapsed}
                />
                <NavItem
                  icon={<FileText className="h-5 w-5" />}
                  label="Gráficas"
                  href="/reportes?tab=charts"
                  isActive={
                    pathname === "/reportes" && new URLSearchParams(window.location.search).get("tab") === "charts"
                  }
                  collapsed={collapsed}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          <NavItem
            icon={<Milk className="h-5 w-5" />}
            label="Ventas"
            href="/ventas"
            isActive={pathname === "/ventas"}
            collapsed={collapsed}
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-[#2a4a04]">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white"
            asChild
          >
            <Link href="/login">
              <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
              {!collapsed && <span>Cerrar Sesión</span>}
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
  collapsed?: boolean
}

function NavItem({ icon, label, href, isActive, collapsed }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-white hover:bg-[#2a4a04] hover:text-white",
        isActive && "bg-[#2a4a04]",
        collapsed && "px-2",
      )}
      asChild
    >
      <Link href={href} title={collapsed ? label : undefined}>
        <span className={cn(collapsed ? "" : "mr-2")}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  )
}

