import { Star } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ReviewCardProps {
  review: any
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Handle cases where users or products might be undefined
  const userName = review.users
    ? `${review.users.first_name || ""} ${review.users.last_name || ""}`.trim()
    : "Anonymous"

  const productName = review.products?.name || ""

  // Generate stars based on rating
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`h-4 w-4 ${i <= review.rating ? "fill-gold text-gold" : "text-gray-300"}`} />)
    }
    return stars
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          <span className="text-gray-500 font-bold text-lg">{userName.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h4 className="font-bold">{userName}</h4>
          {productName && <p className="text-sm text-gray-500">{productName}</p>}
        </div>
      </div>

      <div className="flex mb-2">{renderStars()}</div>

      <h3 className="font-bold text-lg mb-2">{review.title}</h3>
      <p className="text-gray-700 mb-4">{review.content}</p>

      <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
    </div>
  )
}
