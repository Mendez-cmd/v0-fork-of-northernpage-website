"use client"

import { GoogleMapComponent } from "@/components/google-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Smartphone, AlertCircle } from "lucide-react"

export default function MobileTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Mobile Maps Test
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Mobile Testing</h3>
                <p className="text-blue-700 text-sm mt-1">
                  This page tests map functionality on mobile devices with placeholder maps.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mobile Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMapComponent lat={14.5995} lng={120.9842} width={350} height={250} className="w-full" />
            <div className="mt-4 text-sm text-gray-600">
              <p>• Touch-friendly interface</p>
              <p>• Responsive design</p>
              <p>• Optimized for mobile viewing</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
