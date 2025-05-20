"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { CheckCircle, MapPin, Clock, User, CreditCard } from "lucide-react"

export function OrderForm() {
  const [deliveryType, setDeliveryType] = useState("delivery")
  const [deliveryTime, setDeliveryTime] = useState("asap")
  const [pickupTime, setPickupTime] = useState("asap")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(50) // Default delivery fee
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    // Delivery details
    deliveryAddress: "",
    city: "",
    zip: "",
    deliveryInstructions: "",
    deliveryDate: "",
    deliveryTimeSlot: "",

    // Pickup details
    pickupLocation: "",
    pickupDate: "",
    pickupTimeSlot: "",

    // Contact information
    contactName: "",
    contactEmail: "",
    contactPhone: "",

    // Payment details
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    gcashNumber: "",

    // Order notes
    orderNotes: "",
  })

  // Set minimum date for delivery/pickup to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setFormData((prev) => ({
      ...prev,
      deliveryDate: today,
      pickupDate: today,
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order.",
      })
    } else {
      setDiscount(0)
      toast({
        variant: "destructive",
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty cart",
        description: "Your cart is empty. Add some products to place an order.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would normally send the order to your backend
      // For now, we'll just simulate a successful order
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random order number
      const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString()
      setOrderNumber(randomOrderNum)

      setShowSuccessModal(true)
      clearCart()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order failed",
        description: "There was a problem placing your order. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const total = subtotal + (deliveryType === "delivery" ? deliveryFee : 0) - discount

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

        <Tabs defaultValue="delivery" onValueChange={setDeliveryType}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="pickup">Pickup</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="delivery" className="space-y-6">
              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gold" />
                  Delivery Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="ZIP Code"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                    <Textarea
                      id="deliveryInstructions"
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions}
                      onChange={handleChange}
                      placeholder="Any special instructions for delivery"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gold" />
                  Delivery Time
                </h3>

                <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="asap" />
                    <Label htmlFor="asap">As soon as possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">Schedule for later</Label>
                  </div>
                </RadioGroup>

                {deliveryTime === "scheduled" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="deliveryDate">Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        name="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required={deliveryTime === "scheduled"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTimeSlot">Delivery Time</Label>
                      <Select
                        value={formData.deliveryTimeSlot}
                        onValueChange={(value) => handleSelectChange("deliveryTimeSlot", value)}
                      >
                        <SelectTrigger id="deliveryTimeSlot">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                          <SelectItem value="12:00-14:00">12:00 PM - 2:00 PM</SelectItem>
                          <SelectItem value="14:00-16:00">2:00 PM - 4:00 PM</SelectItem>
                          <SelectItem value="16:00-18:00">4:00 PM - 6:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pickup" className="space-y-6">
              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gold" />
                  Pickup Location
                </h3>

                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Select
                    value={formData.pickupLocation}
                    onValueChange={(value) => handleSelectChange("pickupLocation", value)}
                  >
                    <SelectTrigger id="pickupLocation">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-store">Main Store - BLK Try Lot Try South, Caloocan</SelectItem>
                      <SelectItem value="branch-1">Branch 1 - SM North EDSA</SelectItem>
                      <SelectItem value="branch-2">Branch 2 - Trinoma Mall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gold" />
                  Pickup Time
                </h3>

                <RadioGroup value={pickupTime} onValueChange={setPickupTime} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="pickup-asap" />
                    <Label htmlFor="pickup-asap">As soon as possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="pickup-scheduled" />
                    <Label htmlFor="pickup-scheduled">Schedule for later</Label>
                  </div>
                </RadioGroup>

                {pickupTime === "scheduled" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        name="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required={pickupTime === "scheduled"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTimeSlot">Pickup Time</Label>
                      <Select
                        value={formData.pickupTimeSlot}
                        onValueChange={(value) => handleSelectChange("pickupTimeSlot", value)}
                      >
                        <SelectTrigger id="pickupTimeSlot">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                          <SelectItem value="12:00-14:00">12:00 PM - 2:00 PM</SelectItem>
                          <SelectItem value="14:00-16:00">2:00 PM - 4:00 PM</SelectItem>
                          <SelectItem value="16:00-18:00">4:00 PM - 6:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <div className="space-y-6 mt-6">
              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2 text-gold" />
                  Contact Information
                </h3>

                <div>
                  <Label htmlFor="contactName">Full Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gold" />
                  Payment Details
                </h3>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                      <SelectItem value="credit-card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="Card Number"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          placeholder="CVV"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "gcash" && (
                  <div>
                    <Label htmlFor="gcashNumber">GCash Number</Label>
                    <Input
                      id="gcashNumber"
                      name="gcashNumber"
                      value={formData.gcashNumber}
                      onChange={handleChange}
                      placeholder="GCash Number"
                    />
                  </div>
                )}

                {paymentMethod === "bank-transfer" && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium mb-2">Please transfer the total amount to:</p>
                    <p>Bank: BDO</p>
                    <p>Account Name: Northern Chefs</p>
                    <p>Account Number: 1234 5678 9012</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Please upload your proof of payment after completing your order.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                <Textarea
                  id="orderNotes"
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="Any special requests or notes for your order"
                />
              </div>

              <Button type="submit" className="w-full bg-gold hover:bg-amber-500 text-black" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                  </div>
                </div>
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty. Add some products to place an order.
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Input placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
          <Button type="button" onClick={applyPromoCode} variant="outline">
            Apply
          </Button>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {deliveryType === "delivery" && (
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your order. Your order number is <span className="font-bold">{orderNumber}</span>.
              <br />
              We've sent a confirmation email to <span className="font-medium">{formData.contactEmail}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Order Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery/Pickup:</span>
                <span className="capitalize">{deliveryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowSuccessModal(false)}
            >
              Continue Shopping
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto bg-gold hover:bg-amber-500 text-black"
              onClick={() => {
                setShowSuccessModal(false)
                window.location.href = "/account"
              }}
            >
              View Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
