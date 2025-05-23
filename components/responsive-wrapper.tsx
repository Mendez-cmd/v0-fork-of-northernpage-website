"use client"

import type { ReactNode } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface ResponsiveWrapperProps {
  children: ReactNode
  className?: string
}

export function ResponsiveWrapper({ children, className = "" }: ResponsiveWrapperProps) {
  const isMobile = useMobile()

  return <div className={`container mx-auto px-4 ${isMobile ? "py-4" : "py-8"} ${className}`}>{children}</div>
}
