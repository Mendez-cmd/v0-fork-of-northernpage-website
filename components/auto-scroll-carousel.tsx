"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AutoScrollCarouselProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

export function AutoScrollCarousel({
  children,
  className,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
}: AutoScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    addAnimation()
    // Start the animation after a short delay to ensure everything is rendered
    const timer = setTimeout(() => setStart(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const addAnimation = () => {
    if (!containerRef.current || !scrollerRef.current) return

    // Get the width of the content
    const scrollerContent = Array.from(scrollerRef.current.children)
    if (scrollerContent.length === 0) return

    // Calculate the total width of all items
    let totalWidth = 0
    scrollerContent.forEach((item) => {
      totalWidth += (item as HTMLElement).offsetWidth
    })

    // Only animate if the content is wider than the container
    if (totalWidth > containerRef.current.offsetWidth) {
      // Clone the content to create a seamless loop
      const scrollerContentClone = scrollerContent.map((item) => item.cloneNode(true))
      scrollerContentClone.forEach((item) => {
        scrollerRef.current?.appendChild(item)
      })
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative", className)}
      style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
    >
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-4 whitespace-nowrap",
          start && "transition-transform",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{
          animationDuration: `${scrollerRef.current ? scrollerRef.current.scrollWidth / speed : 0}s`,
          animationName: "scroll",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationPlayState: start ? "running" : "paused",
        }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50%));
          }
        }
      `}</style>
    </div>
  )
}
