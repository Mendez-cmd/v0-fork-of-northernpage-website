"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Upload, X } from "lucide-react"

interface ProfilePictureUploadProps {
  userId: string
  currentProfilePicture: string | null
  onUploadComplete: (url: string) => void
}

export function ProfilePictureUpload({ userId, currentProfilePicture, onUploadComplete }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentProfilePicture)
  const [bucketExists, setBucketExists] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { toast } = useToast()

  // Check if the storage bucket exists
  useEffect(() => {
    const checkBucket = async () => {
      try {
        // Try to list files in the bucket to see if it exists
        const { data, error } = await supabase.storage.from("profile-pictures").list("", { limit: 1 })

        if (!error) {
          setBucketExists(true)
        } else {
          console.error("Storage bucket error:", error)
          // Try to create the bucket
          await fetch("/api/db-migrations")
        }
      } catch (error) {
        console.error("Error checking storage bucket:", error)
      }
    }

    checkBucket()
  }, [supabase])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
      })
      return
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Upload the file
    setIsUploading(true)
    try {
      if (!bucketExists) {
        // Try to create the bucket again
        await fetch("/api/db-migrations")
        setBucketExists(true)
      }

      const fileName = `profile-${userId}-${Date.now()}`
      const { data, error } = await supabase.storage.from("profile-pictures").upload(fileName, file, { upsert: true })

      if (error) throw error

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from("profile-pictures").getPublicUrl(fileName)

      // Update user metadata first (this should always work)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { profile_picture: publicUrlData.publicUrl },
      })

      if (metadataError) throw metadataError

      // Try to update the users table
      try {
        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_picture: publicUrlData.publicUrl })
          .eq("id", userId)

        if (updateError && !updateError.message.includes("does not exist")) {
          console.error("Error updating profile_picture in users table:", updateError)
        }
      } catch (dbError) {
        console.error("Error updating user in database:", dbError)
        // Continue even if this fails
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      })

      onUploadComplete(publicUrlData.publicUrl)
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your profile picture. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = async () => {
    setIsUploading(true)
    try {
      // Update user metadata first (this should always work)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { profile_picture: null },
      })

      if (metadataError) throw metadataError

      // Try to update the users table
      try {
        const { error: updateError } = await supabase.from("users").update({ profile_picture: null }).eq("id", userId)

        if (updateError && !updateError.message.includes("does not exist")) {
          console.error("Error updating profile_picture in users table:", updateError)
        }
      } catch (dbError) {
        console.error("Error updating user in database:", dbError)
        // Continue even if this fails
      }

      setPreviewUrl(null)
      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed",
      })

      onUploadComplete("")
    } catch (error) {
      console.error("Error removing profile picture:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error removing your profile picture. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full object-cover w-[150px] h-[150px]"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              disabled={isUploading}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-[150px] h-[150px] bg-gray-200 rounded-full flex items-center justify-center">
            <Camera size={50} className="text-gray-400" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="flex items-center gap-2 bg-gold hover:bg-amber-500 text-black"
      >
        <Upload size={16} />
        {isUploading ? "Uploading..." : "Upload Profile Picture"}
      </Button>
    </div>
  )
}
