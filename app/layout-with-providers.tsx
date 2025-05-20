"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function LayoutWithProviders({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  )
}
