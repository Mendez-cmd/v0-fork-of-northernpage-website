"use client"

import { useState, useEffect, type ReactNode } from "react"
import { LoadingLogo } from "./loading-logo"

interface LoadingWrapperProps {
  children: ReactNode
  loading?: boolean
  delay?: number
  message?: string
}

export function LoadingWrapper({ children, loading = false, delay = 500, message }: LoadingWrapperProps) {
  const [showLoading, setShowLoading] = useState(loading)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 300) // Small delay for transition
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShowLoading(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [loading, delay])

  if (showLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <LoadingLogo message={message} />
      </div>
    )
  }

  return <>{children}</>
}
