import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maps Testing - Northern Chefs",
  description: "Test the Google Maps integration across different devices",
}

export default function TestMapsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Maps Testing Suite</h1>
            <a href="/checkout" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              ← Back to Checkout
            </a>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
