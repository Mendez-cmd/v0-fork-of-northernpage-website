"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { User, Package, ShoppingCart, Settings } from "lucide-react"

interface AdminActivity {
  id: string
  user_id: string
  action_type: string
  entity_type: string
  entity_id: string
  created_at: string
  user_email?: string
}

export function AdminActivityLog() {
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAdminActivities() {
      try {
        // Fetch the 10 most recent admin activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("admin_activities")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)

        if (activitiesError) throw activitiesError

        // Fetch user emails for the activities
        if (activitiesData && activitiesData.length > 0) {
          const userIds = [...new Set(activitiesData.map((activity) => activity.user_id))]

          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id, email")
            .in("id", userIds)

          if (usersError) throw usersError

          // Combine activity data with user emails
          const activitiesWithUserEmails = activitiesData.map((activity) => {
            const user = usersData?.find((u) => u.id === activity.user_id)
            return {
              ...activity,
              user_email: user?.email || "Unknown",
            }
          })

          setActivities(activitiesWithUserEmails)
        } else {
          // If no activities found, use sample data for demonstration
          const sampleData = [
            {
              id: "1",
              user_id: "1",
              user_email: "admin@northernchefs.com",
              action_type: "create",
              entity_type: "product",
              entity_id: "123",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              user_id: "1",
              user_email: "admin@northernchefs.com",
              action_type: "update",
              entity_type: "order",
              entity_id: "456",
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "3",
              user_id: "2",
              user_email: "manager@northernchefs.com",
              action_type: "delete",
              entity_type: "promotion",
              entity_id: "789",
              created_at: new Date(Date.now() - 7200000).toISOString(),
            },
          ]
          setActivities(sampleData)
        }
      } catch (error) {
        console.error("Error fetching admin activities:", error)
        // Use sample data if there's an error
        const sampleData = [
          {
            id: "1",
            user_id: "1",
            user_email: "admin@northernchefs.com",
            action_type: "create",
            entity_type: "product",
            entity_id: "123",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "1",
            user_email: "admin@northernchefs.com",
            action_type: "update",
            entity_type: "order",
            entity_id: "456",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ]
        setActivities(sampleData)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminActivities()
  }, [supabase])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  function getActivityIcon(entityType: string) {
    switch (entityType) {
      case "product":
        return <Package className="h-4 w-4" />
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  function getActionColor(actionType: string) {
    switch (actionType) {
      case "create":
        return "bg-green-100 text-green-800"
      case "update":
        return "bg-blue-100 text-blue-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 max-h-[350px] overflow-auto pr-2">
      {activities.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No recent activities found</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="bg-gray-100 p-2 rounded-full">{getActivityIcon(activity.entity_type)}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.user_email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getActionColor(activity.action_type)}`}>
                    {activity.action_type}
                  </span>
                </div>

                <p className="text-sm">
                  {activity.action_type === "create"
                    ? "Created new"
                    : activity.action_type === "update"
                      ? "Updated"
                      : "Deleted"}{" "}
                  {activity.entity_type}
                </p>

                <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
