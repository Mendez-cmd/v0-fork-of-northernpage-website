import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewsList } from "@/components/admin/reviews/reviews-list"
import { FlaggedReviewsList } from "@/components/admin/reviews/flagged-reviews-list"

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading reviews...</div>}>
                <ReviewsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading flagged reviews...</div>}>
                <FlaggedReviewsList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Reviews Pending Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading pending reviews...</div>}>
                <ReviewsList status="pending" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
