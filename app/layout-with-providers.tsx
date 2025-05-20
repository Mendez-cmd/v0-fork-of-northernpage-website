"use client"

import type React from "react"
import { CartProvider } from "@/hooks/use-cart"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"

interface LayoutWithProvidersProps {
  children: React.ReactNode
}

export default function LayoutWithProviders({ children }: LayoutWithProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CartProvider>
        <Navigation />
        <div className="min-h-screen pt-16">
          {/* Add padding top to account for fixed header */}
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
        </div>
        <Footer />
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  )
}
