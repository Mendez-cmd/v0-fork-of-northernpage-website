"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 10)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-custom-dark flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <Image
            src="/images/Nothernchefslogo.png"
            alt="Northern Chefs Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
        </div>

        <div className="w-64 bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-gold h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-white text-sm">Loading delicious content...</p>
      </div>
    </div>
  )
}
