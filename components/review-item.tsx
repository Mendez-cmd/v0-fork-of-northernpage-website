"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ReviewHelpfulness } from "@/components/review-helpfulness"
import { ReviewReplyForm } from "@/components/review-reply-form"
import { ReviewFlagDialog } from "@/components/review-flag-dialog"
import { useAuth } from "@/hooks/use-auth"

interface ReviewItemProps {
  review: any
  showProductInfo?: boolean
}

export function ReviewItem({ review, showProductInfo = false }: ReviewItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const { user, isAdmin } = useAuth()

  const userName =
    review.users?.first_name && review.users?.last_name
      ? `${review.users.first_name} ${review.users.last_name}`
      : "Anonymous User"

  const userInitials =
    userName !== "Anonymous User" ? `${review.users.first_name?.[0] || ""}${review.users.last_name?.[0] || ""}` : "AU"

  const replies = review.replies || []
  const displayedReplies = showAllReplies ? replies : replies.slice(0, 2)
  const hasMoreReplies = replies.length > 2 && !showAllReplies

  return (
    <Card className="mb-4">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            {review.verified_purchase && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Verified Purchase
              </Badge>
            )}
          </div>
        </div>

        {showProductInfo && review.products && (
          <div className="text-sm text-gray-600">
            Product: <span className="font-medium">{review.products.name}</span>
          </div>
        )}

        <div>
          <h4 className="font-medium">{review.title}</h4>
          <p className="text-gray-700 mt-1">{review.content}</p>
        </div>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            {review.images.map((image: any, index: number) => (
              <img
                key={index}
                src={image.image_url || "/placeholder.svg"}
                alt={image.alt_text || `Review image ${index + 1}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <ReviewHelpfulness reviewId={review.id} helpfulCount={review.helpful_count} />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Reply</span>
            </Button>

            <ReviewFlagDialog reviewId={review.id} />
          </div>
        </div>

        {/* Replies section */}
        {replies.length > 0 && (
          <div className="pl-6 border-l-2 border-gray-200 mt-4 space-y-3">
            {displayedReplies.map((reply: any) => (
              <div key={reply.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {reply.users?.first_name?.[0] || ""}
                      {reply.users?.last_name?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {reply.users?.first_name} {reply.users?.last_name}
                    </span>
                    {reply.is_business_reply && <Badge className="bg-gold text-black text-xs">Official Response</Badge>}
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-8">{reply.content}</p>
                <div className="text-xs text-gray-500 ml-8">{formatDate(reply.created_at)}</div>
              </div>
            ))}

            {hasMoreReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllReplies(true)}
                className="text-gray-500 text-sm"
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>
                  Show {replies.length - 2} more {replies.length - 2 === 1 ? "reply" : "replies"}
                </span>
              </Button>
            )}

            {showAllReplies && replies.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllReplies(false)}
                className="text-gray-500 text-sm"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Show less</span>
              </Button>
            )}
          </div>
        )}

        {showReplyForm && (
          <ReviewReplyForm
            reviewId={review.id}
            isBusinessReply={isAdmin}
            onReplyAdded={() => setShowReplyForm(false)}
          />
        )}
      </CardContent>
    </Card>
  )
}
