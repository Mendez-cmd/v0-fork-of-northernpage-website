"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface SplashScreenProps {
  duration?: number
  onComplete?: () => void
}

export function SplashScreen({ duration = 3000, onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if the user has seen the splash screen before
    const hasSeen = localStorage.getItem("hasSeen")

    if (hasSeen) {
      setIsVisible(false)
      if (onComplete) onComplete()
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem("hasSeen", "true")
      if (onComplete) onComplete()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10"
            >
              <Image
                src="/images/Nothernchefslogo.png"
                alt="Northern Chefs Logo"
                width={300}
                height={120}
                priority
                className="drop-shadow-[0_0_30px_rgba(255,215,0,0.7)]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-gold text-xl font-medium">Homemade Food Trading</p>
              <p className="text-white/70 mt-2">Authentic Filipino Cuisine</p>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-1 bg-gold mt-8 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
