import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

