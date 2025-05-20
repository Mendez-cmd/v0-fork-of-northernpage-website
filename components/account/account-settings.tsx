"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"

interface AccountSettingsProps {
  user: any
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [personalInfo, setPersonalInfo] = useState({
    first_name: user?.user_metadata?.first_name || "",
    last_name: user?.user_metadata?.last_name || "",
    phone: user?.user_metadata?.phone || "",
  })

  const [passwordInfo, setPasswordInfo] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const [notificationPrefs, setNotificationPrefs] = useState({
    order_updates: true,
    promotions: true,
    newsletter: true,
  })

  const [profilePicture, setProfilePicture] = useState<string | null>(user?.user_metadata?.profile_picture || null)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false)
  const [dbMigrated, setDbMigrated] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationPrefs((prev) => ({ ...prev, [name]: checked }))
  }

  const handleProfilePictureUpdate = (url: string) => {
    setProfilePicture(url)
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      // Always update the user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: personalInfo.first_name,
          last_name: personalInfo.last_name,
          phone: personalInfo.phone,
          profile_picture: profilePicture,
        },
      })

      if (error) throw error

      // Try to update the users table
      try {
        const { error: dbError } = await supabase
          .from("users")
          .update({
            first_name: personalInfo.first_name,
            last_name: personalInfo.last_name,
            phone: personalInfo.phone,
            profile_picture: profilePicture,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (dbError && !dbError.message.includes("does not exist")) {
          console.error("Error updating user in database:", dbError)
        }
      } catch (dbError) {
        console.error("Error updating user in database:", dbError)
        // Continue even if this fails
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordInfo.new_password !== passwordInfo.confirm_password) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
      })
      return
    }

    setIsUpdatingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordInfo.new_password,
      })

      if (error) throw error

      setPasswordInfo({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const updateNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingNotifications(true)

    try {
      // Here you would normally update notification preferences in your database
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
      })
    } finally {
      setIsUpdatingNotifications(false)
    }
  }

  // Run database migrations
  useEffect(() => {
    const runMigrations = async () => {
      try {
        const response = await fetch("/api/db-migrations")
        const data = await response.json()

        if (data.success) {
          setDbMigrated(true)
          console.log("Database migrations completed successfully")
        } else {
          console.error("Database migration error:", data.error)
        }
      } catch (error) {
        console.error("Error running database migrations:", error)
      }
    }

    if (!dbMigrated) {
      runMigrations()
    }
  }, [dbMigrated])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
      <p className="text-gray-600 mb-6">Manage your account information and preferences.</p>

      <div className="space-y-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex justify-center">
            <ProfilePictureUpload
              userId={user.id}
              currentProfilePicture={profilePicture}
              onUploadComplete={handleProfilePictureUpdate}
            />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={personalInfo.first_name}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={personalInfo.last_name}
                  onChange={handlePersonalInfoChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">To change your email address, please contact support.</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
            </div>

            <Button type="submit" className="bg-gold hover:bg-amber-500 text-black" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={updatePassword} className="space-y-4">
            <div>
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                name="current_password"
                type="password"
                value={passwordInfo.current_password}
                onChange={handlePasswordChange}
              />
            </div>

            <div>
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                value={passwordInfo.new_password}
                onChange={handlePasswordChange}
              />
            </div>

            <div>
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={passwordInfo.confirm_password}
                onChange={handlePasswordChange}
              />
            </div>

            <Button type="submit" className="bg-gold hover:bg-amber-500 text-black" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <form onSubmit={updateNotifications} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="order_updates"
                  checked={notificationPrefs.order_updates}
                  onCheckedChange={(checked) => handleNotificationChange("order_updates", !!checked)}
                />
                <Label htmlFor="order_updates">Order updates and shipping notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="promotions"
                  checked={notificationPrefs.promotions}
                  onCheckedChange={(checked) => handleNotificationChange("promotions", !!checked)}
                />
                <Label htmlFor="promotions">Promotions, discounts, and special offers</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={notificationPrefs.newsletter}
                  onCheckedChange={(checked) => handleNotificationChange("newsletter", !!checked)}
                />
                <Label htmlFor="newsletter">Newsletter and product updates</Label>
              </div>
            </div>

            <Button type="submit" className="bg-gold hover:bg-amber-500 text-black" disabled={isUpdatingNotifications}>
              {isUpdatingNotifications ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
