"use client"

import { useState, useEffect } from "react"
import { PlaceholderImage } from "@/components/placeholder-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPlaceholderPage() {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">PlaceholderImage Component Test</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Current Screen Width: {windowWidth}px</h2>
        <p className="mb-4">
          Resize your browser window to see how the PlaceholderImage component responds to different screen sizes.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Fixed Sizes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Small (50x50)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Small Size" width={50} height={50} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medium (100x100)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Medium Size" width={100} height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Large (200x200)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Large Size" width={200} height={200} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extra Large (300x300)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Extra Large" width={300} height={300} />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Responsive Sizes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Full Width Container</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video">
              <PlaceholderImage name="Full Width" className="w-full h-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Half Width Container</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-square">
              <PlaceholderImage name="Half Width" className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Different Names</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Single Word</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Product" width={100} height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Two Words</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Chicken Pastil" width={100} height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Long Name</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Very Long Product Name" width={100} height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Name (Default)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage width={100} height={100} />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Edge Cases</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>No Width/Height</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
              <PlaceholderImage name="No Dimensions" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empty String Name</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="" width={100} height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Very Small (10x10)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlaceholderImage name="Tiny" width={10} height={10} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
