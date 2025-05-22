"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

interface GoogleMapComponentProps {
  lat: number
  lng: number
  zoom?: number
  width?: number
  height?: number
  className?: string
}

export function GoogleMapComponent({
  lat,
  lng,
  zoom = 15,
  width = 600,
  height = 400,
  className = "",
}: GoogleMapComponentProps) {
  const [mapStatus, setMapStatus] = useState<"loading" | "available" | "unavailable">("loading")

  useEffect(() => {
    // Check if maps are available
    fetch("/api/maps")
      .then((res) => res.json())
      .then((data) => {
        setMapStatus(data.hasKey ? "available" : "unavailable")
      })
      .catch(() => {
        setMapStatus("unavailable")
      })
  }, [])

  if (mapStatus === "loading") {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  // Always show placeholder since we removed API key functionality
  return (
    <div className={`relative ${className}`}>
      <img
        src={`/api/maps/static?lat=${lat}&lng=${lng}&zoom=${zoom}&width=${width}&height=${height}`}
        alt={`Map showing location at ${lat}, ${lng}`}
        width={width}
        height={height}
        className="rounded-lg border"
      />
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-xs flex items-center gap-1">
        <MapPin className="w-3 h-3 text-red-500" />
        <span>Delivery Location</span>
      </div>
    </div>
  )
}
