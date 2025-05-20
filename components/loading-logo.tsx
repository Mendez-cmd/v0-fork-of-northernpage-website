"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

type LoadingLogoProps = {
  size?: "sm" | "md" | "lg"
  message?: string
  duration?: number
  showText?: boolean
}

export default function LoadingLogo({
  size = "md",
  message = "Loading...",
  duration = 1500,
  showText = true,
}: LoadingLogoProps) {
  const [opacity, setOpacity] = useState(0.6)

  // Define sizes with proper fallbacks
  const sizeValues = {
    sm: { width: 80, height: 32 },
    md: { width: 150, height: 60 },
    lg: { width: 240, height: 96 },
  }

  // Ensure we have a valid size
  const validSize = (sizeValues[size] ? size : "md") as keyof typeof sizeValues
  const { width, height } = sizeValues[validSize]

  useEffect(() => {
    if (duration === 0) return // Skip animation if duration is 0

    let interval: NodeJS.Timeout
    let direction = 1

    interval = setInterval(() => {
      setOpacity((prev) => {
        const newOpacity = prev + 0.05 * direction

        if (newOpacity >= 1) direction = -1
        if (newOpacity <= 0.6) direction = 1

        return newOpacity
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="transition-opacity duration-300" style={{ opacity: duration === 0 ? 1 : opacity }}>
        <Image src="/images/Nothernchefslogo.png" alt="Northern Chefs Logo" width={width} height={height} priority />
      </div>
      {showText && message && <p className="mt-4 text-gray-600 animate-pulse">{message}</p>}
    </div>
  )
}

// Also export as named export for compatibility
export { LoadingLogo }
