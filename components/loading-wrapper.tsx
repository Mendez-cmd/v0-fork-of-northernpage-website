import type React from "react"
import { LoadingLogo } from "./loading-logo"

interface LoadingWrapperProps {
  message?: string
  size?: "small" | "medium" | "large"
  showText?: boolean
  children?: React.ReactNode
  className?: string
}

export function LoadingWrapper({
  message = "Loading...",
  size = "medium",
  showText = true,
  children,
  className = "",
}: LoadingWrapperProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingLogo size={size} showText={showText} />
      {message && <p className="mt-4 text-gray-600 animate-pulse">{message}</p>}
      {children}
    </div>
  )
}
