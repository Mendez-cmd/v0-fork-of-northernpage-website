"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Edit, Trash2, Tag, Calendar, PercentIcon, DollarSign } from "lucide-react"
import Link from "next/link"

interface Promotion {
  id: string
  name: string
  code: string
  discount_type: "percentage" | "fixed_amount"
  discount_value: number
  minimum_order_amount: number
  starts_at: string
  ends_at: string
  is_active: boolean
  usage_limit: number | null
  usage_count: number
}

interface PromotionsListProps {
  filter: "all" | "active" | "scheduled" | "expired"
}

export function PromotionsList({ filter }: PromotionsListProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPromotions() {
      try {
        let query = supabase.from("promotions").select("*")

        const now = new Date().toISOString()

        // Apply filter
        if (filter === "active") {
          query = query.eq("is_active", true).lt("starts_at", now).gt("ends_at", now)
        } else if (filter === "scheduled") {
          query = query.gt("starts_at", now)
        } else if (filter === "expired") {
          query = query.lt("ends_at", now)
        }

        const { data, error } = await query.order("starts_at", { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          setPromotions(data)
        } else {
          // If no data or empty array, use sample data
          const sampleData: Promotion[] = [
            {
              id: "1",
              name: "Summer Sale",
              code: "SUMMER20",
              discount_type: "percentage",
              discount_value: 20,
              minimum_order_amount: 1000,
              starts_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              ends_at: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
              is_active: true,
              usage_limit: 100,
              usage_count: 45,
            },
            {
              id: "2",
              name: "Welcome Discount",
              code: "WELCOME",
              discount_type: "fixed_amount",
              discount_value: 200,
              minimum_order_amount: 1500,
              starts_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
              ends_at: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
              is_active: true,
              usage_limit: 50,
              usage_count: 12,
            },
            {
              id: "3",
              name: "Holiday Special",
              code: "HOLIDAY25",
              discount_type: "percentage",
              discount_value: 25,
              minimum_order_amount: 2000,
              starts_at: new Date(Date.now() + 1209600000).toISOString(), // 14 days from now
              ends_at: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
              is_active: true,
              usage_limit: null,
              usage_count: 0,
            },
            {
              id: "4",
              name: "Flash Sale",
              code: "FLASH15",
              discount_type: "percentage",
              discount_value: 15,
              minimum_order_amount: 500,
              starts_at: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
              ends_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
              is_active: false,
              usage_limit: 200,
              usage_count: 187,
            },
          ]

          // Filter sample data based on the filter prop
          const now = new Date()
          let filteredSampleData = sampleData

          if (filter === "active") {
            filteredSampleData = sampleData.filter(
              (promo) => promo.is_active && new Date(promo.starts_at) <= now && new Date(promo.ends_at) >= now,
            )
          } else if (filter === "scheduled") {
            filteredSampleData = sampleData.filter((promo) => new Date(promo.starts_at) > now)
          } else if (filter === "expired") {
            filteredSampleData = sampleData.filter((promo) => new Date(promo.ends_at) < now)
          }

          setPromotions(filteredSampleData)
        }
      } catch (error) {
        console.error("Error fetching promotions:", error)
        // Use sample data if there's an error
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [supabase, filter])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  function getPromotionStatus(promotion: Promotion) {
    const now = new Date()
    const startDate = new Date(promotion.starts_at)
    const endDate = new Date(promotion.ends_at)

    if (!promotion.is_active) {
      return { label: "Inactive", variant: "destructive" as const }
    } else if (startDate > now) {
      return { label: "Scheduled", variant: "outline" as const }
    } else if (endDate < now) {
      return { label: "Expired", variant: "destructive" as const }
    } else {
      return { label: "Active", variant: "default" as const }
    }
  }

  return (
    <div className="space-y-4">
      {promotions.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No promotions found</p>
        </Card>
      ) : (
        promotions.map((promotion) => {
          const status = getPromotionStatus(promotion)

          return (
            <Card key={promotion.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{promotion.name}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>
                        Code: <span className="font-mono">{promotion.code}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {promotion.discount_type === "percentage" ? (
                        <>
                          <PercentIcon className="h-4 w-4" />
                          <span>{promotion.discount_value}% off</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(promotion.discount_value)} off</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(promotion.starts_at)} - {formatDate(promotion.ends_at)}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span>Min. Order: {formatCurrency(promotion.minimum_order_amount)}</span>
                    {promotion.usage_limit && (
                      <span className="ml-4">
                        Usage: {promotion.usage_count} / {promotion.usage_limit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Link href={`/admin/promotions/${promotion.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>

                  <Button variant="outline" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}
