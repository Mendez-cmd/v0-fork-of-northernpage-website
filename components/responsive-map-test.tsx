"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GoogleMapComponent } from "@/components/google-map"
import { Maximize2, Minimize2 } from "lucide-react"

interface ResponsiveMapTestProps {
  location: {
    id: string
    name: string
    address: string
    phone: string
    email: string
    lat: number
    lng: number
    hours?: string
  }
}

export function ResponsiveMapTest({ location }: ResponsiveMapTestProps) {
  const [containerSize, setContainerSize] = useState<"small" | "medium" | "large">("medium")

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-2xl",
  }

  const sizeLabels = {
    small: "Small (384px)",
    medium: "Medium (448px)",
    large: "Large (672px)",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Responsive Container Test
          <div className="flex gap-2">
            {Object.entries(sizeLabels).map(([size, label]) => (
              <Button
                key={size}
                size="sm"
                variant={containerSize === size ? "default" : "outline"}
                onClick={() => setContainerSize(size as keyof typeof sizeClasses)}
              >
                {size === "small" && <Minimize2 className="h-4 w-4 mr-1" />}
                {size === "large" && <Maximize2 className="h-4 w-4 mr-1" />}
                {label}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`mx-auto transition-all duration-300 ${sizeClasses[containerSize]}`}>
          <GoogleMapComponent location={location} height="250px" />
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">Current container: {sizeLabels[containerSize]}</div>
      </CardContent>
    </Card>
  )
}
