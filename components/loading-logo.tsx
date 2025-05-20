"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LoadingLogoProps {
  size?: "small" | "medium" | "large"
  showText?: boolean
  duration?: number
}

export function LoadingLogo({ size = "medium", showText = true, duration = 2000 }: LoadingLogoProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Size mapping
  const sizeMap = {
    small: {
      width: 100,
      height: 40,
      containerClass: "h-20",
    },
    medium: {
      width: 180,
      height: 70,
      containerClass: "h-32",
    },
    large: {
      width: 250,
      height: 100,
      containerClass: "h-48",
    },
  }

  useEffect(() => {
    // If duration is 0, don't hide the logo
    if (duration === 0) return

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-custom-dark z-50">
      <div className={`relative ${sizeMap[size].containerClass} flex items-center justify-center`}>
        <div className="absolute animate-pulse">
          <Image
            src="/images/Nothernchefslogo.png"
            alt="Northern Chefs Logo"
            width={sizeMap[size].width}
            height={sizeMap[size].height}
            priority
            className="drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
          />
        </div>
        <div className="absolute animate-spin-slow opacity-30">
          <div className="w-[calc(100%+40px)] h-[calc(100%+40px)] rounded-full border-2 border-gold border-dashed"></div>
        </div>
      </div>
      {showText && (
        <div className="mt-6 text-white text-center">
          <p className="text-lg font-medium animate-pulse">Loading delicious homemade goodness...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <span className="h-2 w-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="h-2 w-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="h-2 w-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>
      )}
    </div>
  )
}

// Add default export
export default LoadingLogo
