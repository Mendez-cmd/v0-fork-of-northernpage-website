"use client"

import type React from "react"

import { useState, useEffect } from "react"
import LoadingLogo from "./loading-logo"

interface SplashScreenProps {
  children: React.ReactNode
  duration?: number
  message?: string
}

export function SplashScreen({ children, duration = 1500, message = "Welcome to Northern Chefs" }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-40">
        <LoadingLogo size="lg" message={message} duration={0} />
      </div>
    )
  }

  return <>{children}</>
}
