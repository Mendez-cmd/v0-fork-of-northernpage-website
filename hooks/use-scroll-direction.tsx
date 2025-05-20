"use client"

import { useState, useEffect } from "react"

type ScrollDirection = "up" | "down" | null

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      // Determine if we're at the top of the page
      setIsAtTop(scrollY < 10)

      // Need some threshold to avoid tiny movements
      const threshold = 10

      // Determine scroll direction
      const direction = scrollY > lastScrollY ? "down" : "up"

      // Only update direction if we've scrolled more than the threshold
      if (Math.abs(scrollY - lastScrollY) > threshold) {
        setScrollDirection(direction)
      }

      setLastScrollY(scrollY)
    }

    // Add scroll event listener
    window.addEventListener("scroll", updateScrollDirection)

    // Set initial values
    updateScrollDirection()

    return () => {
      window.removeEventListener("scroll", updateScrollDirection)
    }
  }, [lastScrollY])

  return { scrollDirection, isAtTop }
}
