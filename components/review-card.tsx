import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ReviewCardProps {
  review: any
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`h-4 w-4 ${i <= rating ? "fill-gold text-gold" : "text-gray-300"}`} />)
    }
    return stars
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold line-clamp-1">{review.title}</h4>
          <div className="flex">{renderStars(review.rating)}</div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{review.content}</p>

        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
          <span className="font-medium">
            {review.users?.first_name} {review.users?.last_name?.charAt(0)}.
          </span>
          <span>{formatDate(review.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
