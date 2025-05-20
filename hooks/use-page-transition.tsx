"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function usePageTransition() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isRouteChanging, setIsRouteChanging] = useState(false)
  const [prevRoute, setPrevRoute] = useState("")

  useEffect(() => {
    // Route change started
    setIsRouteChanging(true)

    // Store previous route
    setPrevRoute(pathname)

    // Route change completed
    const timeout = setTimeout(() => {
      setIsRouteChanging(false)
    }, 500) // Match this with your transition duration

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return {
    isRouteChanging,
    prevRoute,
    currentRoute: pathname,
  }
}
