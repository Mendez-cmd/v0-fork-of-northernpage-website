"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addReviewReply } from "@/app/actions/reviews"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface ReviewReplyFormProps {
  reviewId: string
  isBusinessReply?: boolean
  onReplyAdded?: () => void
}

export function ReviewReplyForm({ reviewId, isBusinessReply = false, onReplyAdded }: ReviewReplyFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to reply to reviews.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await addReviewReply(reviewId, content, isBusinessReply)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Reply added",
        description: "Your reply has been added successfully.",
      })

      setContent("")
      onReplyAdded?.()
    } catch (error) {
      console.error("Error adding reply:", error)
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <Textarea
        placeholder={isBusinessReply ? "Add an official response to this review..." : "Add a reply..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className={isBusinessReply ? "border-gold focus:ring-gold" : ""}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className={isBusinessReply ? "bg-gold hover:bg-amber-600 text-black" : ""}
        >
          {isSubmitting ? "Submitting..." : isBusinessReply ? "Post Official Response" : "Post Reply"}
        </Button>
      </div>
    </div>
  )
}
