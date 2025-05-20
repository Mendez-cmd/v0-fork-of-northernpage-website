"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/hooks/use-cart"
import { PageTransition } from "@/components/page-transition"
import { LoadingTransition } from "@/components/loading-transition"
import type { ReactNode } from "react"

interface LayoutWithProvidersProps {
  children: ReactNode
}

export default function LayoutWithProviders({ children }: LayoutWithProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <CartProvider>
        <LoadingTransition>
          <PageTransition>{children}</PageTransition>
        </LoadingTransition>
      </CartProvider>
    </ThemeProvider>
  )
}
