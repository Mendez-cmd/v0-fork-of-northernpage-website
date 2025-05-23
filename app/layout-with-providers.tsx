"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { FloatingReviewButton } from "@/components/floating-review-button"
import { PageWrapper } from "@/components/page-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { CartStatusIndicator } from "@/components/cart-status-indicator"
import { useState, useEffect } from "react"

export default function LayoutWithProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")
  const [showCartIndicator, setShowCartIndicator] = useState(false)

  // Only show the cart indicator in test mode
  useEffect(() => {
    const isTestMode = pathname?.includes("test-cart") || localStorage.getItem("cart-test-mode") === "true"
    setShowCartIndicator(isTestMode)

    if (pathname?.includes("test-cart")) {
      localStorage.setItem("cart-test-mode", "true")
    }
  }, [pathname])

  return (
    <AuthProvider>
      <CartProvider>
        {!isAdminPage && <Navigation />}
        <div className="min-h-screen">
          <PageWrapper>
            <main>{children}</main>
          </PageWrapper>
        </div>
        {!isAdminPage && <Footer />}
        <Toaster />
        <FloatingReviewButton />
        {showCartIndicator && <CartStatusIndicator />}
      </CartProvider>
    </AuthProvider>
  )
}
