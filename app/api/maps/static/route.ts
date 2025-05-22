import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const width = Number.parseInt(searchParams.get("width") || "600")
  const height = Number.parseInt(searchParams.get("height") || "400")

  // Validate parameters
  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing required parameters: lat and lng" }, { status: 400 })
  }

  try {
    // Create a simple placeholder image using Canvas API or return a static placeholder
    // This removes dependency on Google Maps API entirely

    // Generate a simple SVG placeholder map
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="8" fill="#ef4444"/>
        <text x="${width / 2}" y="${height / 2 + 30}" text-anchor="middle" font-family="Arial" font-size="12" fill="#374151">
          Location: ${lat}, ${lng}
        </text>
        <text x="${width / 2}" y="${height / 2 + 50}" text-anchor="middle" font-family="Arial" font-size="10" fill="#6b7280">
          Map placeholder
        </text>
      </svg>
    `

    return new NextResponse(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error generating placeholder map:", error)
    return NextResponse.json({ error: "Failed to generate map placeholder" }, { status: 500 })
  }
}
