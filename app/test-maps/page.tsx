"use client"

import { GoogleMapComponent } from "@/components/google-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, AlertCircle } from "lucide-react"

export default function TestMapsPage() {
  // Sample coordinates for testing (Manila, Philippines)
  const testLocations = [
    { name: "Manila", lat: 14.5995, lng: 120.9842 },
    { name: "Quezon City", lat: 14.676, lng: 121.0437 },
    { name: "Makati", lat: 14.5547, lng: 121.0244 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Maps Testing Page</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Maps Functionality</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Currently showing placeholder maps. To enable full Google Maps functionality, configure the Google
                  Maps API key in your environment variables.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {testLocations.map((location, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {location.name}
                </CardTitle>
                <CardDescription>
                  Coordinates: {location.lat}, {location.lng}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleMapComponent lat={location.lat} lng={location.lng} width={600} height={300} className="w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
