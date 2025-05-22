import { NextResponse } from "next/server"

export async function GET() {
  // Return a simple status without referencing any environment variables
  return NextResponse.json({
    hasKey: false,
    status: "unavailable",
    message: "Maps functionality is currently disabled",
  })
}
