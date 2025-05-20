"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function usePageTransition() {
  const pathname = usePathname()
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)
  const [previousPath, setPreviousPath] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsPageTransitioning(true)
      setPreviousPath(currentPath)

      // Short timeout to allow exit animation to complete
      const timeout = setTimeout(() => {
        setCurrentPath(pathname)

        // Allow time for entry animation
        setTimeout(() => {
          setIsPageTransitioning(false)
        }, 400)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [pathname, currentPath])

  return {
    isPageTransitioning,
    currentPath,
    previousPath,
  }
}
