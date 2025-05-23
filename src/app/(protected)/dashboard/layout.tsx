"use client"

import type React from "react"

import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"
import { Footer } from "@/components/ui/footer"
import { ProtectedRoute } from "@/components/ui/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-[#e8f0d8] p-6 overflow-auto">{children}</main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

