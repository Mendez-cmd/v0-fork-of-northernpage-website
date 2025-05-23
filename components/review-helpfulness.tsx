"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { markReviewHelpful } from "@/app/actions/reviews"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface ReviewHelpfulnessProps {
  reviewId: string
  helpfulCount: number
  onUpdate?: () => void
}

export function ReviewHelpfulness({ reviewId, helpfulCount, onUpdate }: ReviewHelpfulnessProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localHelpfulCount, setLocalHelpfulCount] = useState(helpfulCount)
  const [userVote, setUserVote] = useState<boolean | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleVote = async (isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to vote on reviews.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await markReviewHelpful(reviewId, isHelpful)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      // Toggle vote if clicking the same button
      if (userVote === isHelpful) {
        setUserVote(null)
        setLocalHelpfulCount((prev) => (isHelpful ? prev - 1 : prev))
      }
      // Change vote if voting differently
      else if (userVote !== null) {
        setUserVote(isHelpful)
        setLocalHelpfulCount((prev) => (isHelpful ? prev + 1 : prev - 1))
      }
      // New vote
      else {
        setUserVote(isHelpful)
        setLocalHelpfulCount((prev) => (isHelpful ? prev + 1 : prev))
      }

      onUpdate?.()
    } catch (error) {
      console.error("Error voting on review:", error)
      toast({
        title: "Error",
        description: "Failed to register your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-4 mt-2">
      <div className="text-sm text-gray-600">Was this review helpful?</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVote(true)}
          disabled={isSubmitting}
          className={userVote === true ? "bg-green-50 border-green-200" : ""}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>Yes</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVote(false)}
          disabled={isSubmitting}
          className={userVote === false ? "bg-red-50 border-red-200" : ""}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          <span>No</span>
        </Button>
      </div>
      {localHelpfulCount > 0 && (
        <div className="text-sm text-gray-600">
          {localHelpfulCount} {localHelpfulCount === 1 ? "person" : "people"} found this helpful
        </div>
      )}
    </div>
  )
}
