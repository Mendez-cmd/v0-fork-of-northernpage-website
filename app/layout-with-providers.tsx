"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/hooks/use-cart"
import PageTransition from "@/components/page-transition"
import type { ReactNode } from "react"

export default function LayoutWithProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        <PageTransition>{children}</PageTransition>
      </CartProvider>
    </ThemeProvider>
  )
}
