"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { User, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AuthStatusIndicator() {
  const { user, isAdmin, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2">
          <User className="h-5 w-5 text-red-400" />
          <span className="text-sm">Not authenticated</span>
          <Link href="/test-auth">
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Test Auth
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Auth Status (Dev Only)</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>

          <div className="flex items-center mb-3">
            {user.user_metadata?.profile_picture ? (
              <Image
                src={user.user_metadata.profile_picture || "/placeholder.svg"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black mr-3">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="font-medium">
                {user.user_metadata?.first_name
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
                  : user.email?.split("@")[0]}
              </div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-amber-900/30 text-amber-300 text-xs p-2 rounded flex items-center mb-3">
              <Shield className="h-4 w-4 mr-2" />
              Admin privileges active
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link href="/test-auth">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Auth Test Page
              </Button>
            </Link>
            <Button size="sm" variant="destructive" className="w-full text-xs" onClick={() => signOut()}>
              <LogOut className="h-3 w-3 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-full h-10 w-10 p-0 flex items-center justify-center shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          {isAdmin ? <Shield className="h-5 w-5 text-amber-300" /> : <User className="h-5 w-5 text-green-400" />}
        </Button>
      )}
    </div>
  )
}
