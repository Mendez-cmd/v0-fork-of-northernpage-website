"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { FloatingReviewButton } from "@/components/floating-review-button"
import { ThemeProvider } from "@/components/theme-provider"
import { PageTransition } from "@/components/page-transition"
import { Toaster } from "@/components/ui/toaster"

export default function LayoutWithProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <CartProvider>
          <Navigation />
          <div className="min-h-screen pt-16">
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
          </div>
          <Footer />
          <Toaster />
          <FloatingReviewButton />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
