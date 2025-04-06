import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex min-h-screen items-center justify-center bg-[#6b7c45] p-4">{children}</div>
}

