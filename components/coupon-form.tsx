"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface CouponFormProps {
  onDiscountApplied: (discount: number) => void
}

export function CouponForm({ onDiscountApplied }: CouponFormProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const { toast } = useToast()

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single()

      if (error || !coupon) {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid or has expired.",
          variant: "destructive",
        })
        return
      }

      // Check if coupon is still valid
      const now = new Date()
      const expiryDate = new Date(coupon.expiry_date)

      if (expiryDate < now) {
        toast({
          title: "Expired Coupon",
          description: "This coupon has expired.",
          variant: "destructive",
        })
        return
      }

      // Apply discount
      setAppliedCoupon(coupon)
      onDiscountApplied(coupon.discount_amount)

      toast({
        title: "Coupon Applied!",
        description: `You saved ${coupon.discount_amount}!`,
      })
    } catch (error) {
      console.error("Error applying coupon:", error)
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    onDiscountApplied(0)
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    })
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="coupon">Coupon Code</Label>
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div>
            <p className="font-medium text-green-800">{appliedCoupon.code}</p>
            <p className="text-sm text-green-600">{appliedCoupon.description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={removeCoupon}>
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            id="coupon"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={applyCoupon} disabled={isLoading || !couponCode.trim()} variant="outline">
            {isLoading ? "Applying..." : "Apply"}
          </Button>
        </div>
      )}
    </div>
  )
}
