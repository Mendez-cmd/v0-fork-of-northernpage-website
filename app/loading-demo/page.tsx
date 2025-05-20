"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingLogo } from "@/components/loading-logo"

export default function LoadingDemo() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium")
  const [showText, setShowText] = useState(true)
  const [showLoading, setShowLoading] = useState(false)
  const [duration, setDuration] = useState(5000)

  const handleShowLoading = () => {
    setShowLoading(true)
    setTimeout(() => {
      setShowLoading(false)
    }, duration)
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Loading Animation Demo</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Customize Loading Animation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="size"
                  checked={size === "small"}
                  onChange={() => setSize("small")}
                  className="mr-2"
                />
                Small
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="size"
                  checked={size === "medium"}
                  onChange={() => setSize("medium")}
                  className="mr-2"
                />
                Medium
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="size"
                  checked={size === "large"}
                  onChange={() => setSize("large")}
                  className="mr-2"
                />
                Large
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Show Text</label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showText}
                onChange={() => setShowText(!showText)}
                className="mr-2"
              />
              Display loading text
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (ms)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="1000"
              step="1000"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleShowLoading} className="bg-gold hover:bg-amber-500 text-black">
            Show Loading Animation
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="bg-custom-dark rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
          <div className="relative h-32 flex items-center justify-center">
            <div className="animate-pulse">
              <img
                src="/images/Nothernchefslogo.png"
                alt="Northern Chefs Logo"
                className="h-16 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              />
            </div>
            <div className="absolute animate-spin-slow opacity-30">
              <div className="w-[calc(100%+40px)] h-[calc(100%+40px)] rounded-full border-2 border-gold border-dashed"></div>
            </div>
          </div>
        </div>
      </div>

      {showLoading && <LoadingLogo size={size} showText={showText} duration={duration} />}
    </div>
  )
}
