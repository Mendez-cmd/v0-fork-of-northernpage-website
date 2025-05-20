"use client"

import { useState, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { LoadingLogo } from "./loading-logo"

interface LoadingTransitionProps {
  children: ReactNode
}

export function LoadingTransition({ children }: LoadingTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [prevPathname, setPrevPathname] = useState<string | null>(null)

  useEffect(() => {
    // If the pathname changes, show loading
    if (prevPathname !== null && prevPathname !== pathname) {
      setIsLoading(true)
    }

    setPrevPathname(pathname)

    // Simulate loading time (can be replaced with real loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname, prevPathname])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
          >
            <LoadingLogo size="large" message={`Loading ${pathname === "/" ? "home" : pathname.slice(1)}`} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
