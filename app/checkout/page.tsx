"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { CouponForm } from "@/components/coupon-form"
import { ShippingCalculator } from "@/components/shipping-calculator"
import { GoogleMapComponent } from "@/components/google-map"
import { CreditCard, Truck, MapPin, Clock, User, AlertCircle, Map } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getFallbackImage } from "@/lib/default-images"

// Define the pickup locations with coordinates and store hours
const pickupLocations = [
  {
    id: "ChIJXbGqF9e2lzMRXJA47vc8C-s",
    name: "Northern Chefs Main Branch",
    address: "P3R6+JXX, Everlasting, Lungsod Quezon, Kalakhang Maynila",
    fullAddress: "P3R6+JXX, Everlasting Street, Barangay Commonwealth, Quezon City, Metro Manila 1121",
    phone: "+63 917 123 4567",
    email: "pickup@northernchefs.com",
    lat: 14.676,
    lng: 121.0437,
    hours: "Monday - Sunday: 9:00 AM - 9:00 PM",
    description: "Our main branch and kitchen facility located in the heart of Quezon City",
    landmarks: "Near Commonwealth Market, across from Jollibee Commonwealth",
    parkingInfo: "Free parking available for pickup customers",
    contactPerson: "Store Manager: Maria Santos",
  },
]

// Available time slots
const timeSlots = [
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryType, setDeliveryType] = useState("delivery")
  const [selectedLocation, setSelectedLocation] = useState<(typeof pickupLocations)[0] | null>(null)

  const [formData, setFormData] = useState({
    // Shipping Address (for delivery)
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Philippines",

    // Pickup Information
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    pickupPersonName: "",
    pickupNotes: "",

    // Payment
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    gcashNumber: "",

    // Order Notes
    orderNotes: "",
  })

  const subtotal = total || 0
  const tax = subtotal * 0.12 || 0 // 12% VAT
  const pickupFee = 0 // No fee for pickup
  const currentShippingCost = deliveryType === "delivery" ? shippingCost || 0 : pickupFee
  const finalTotal = subtotal + currentShippingCost + tax - discount || 0

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && !isLoading) {
        router.push("/login?redirect=/checkout")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router, isLoading])

  // Update selected location when pickup location changes
  useEffect(() => {
    if (formData.pickupLocation) {
      const location = pickupLocations.find((loc) => loc.id === formData.pickupLocation)
      setSelectedLocation(location || null)
    } else {
      setSelectedLocation(null)
    }
  }, [formData.pickupLocation])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const orderData = {
        user_id: user?.id,
        total_amount: finalTotal,
        shipping_fee: currentShippingCost,
        tax_amount: tax,
        discount_amount: discount,
        status: "processing",
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        notes: formData.orderNotes,
      }

      if (deliveryType === "delivery") {
        orderData.shipping_address = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
      } else {
        const selectedLocation = pickupLocations.find((loc) => loc.id === formData.pickupLocation)
        orderData.pickup_location = selectedLocation?.name
        orderData.pickup_address = selectedLocation?.address
        orderData.pickup_date = formData.pickupDate
        orderData.pickup_time = formData.pickupTime
        orderData.pickup_person = formData.pickupPersonName
        orderData.pickup_notes = formData.pickupNotes
      }

      const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to continue checkout</h2>
        <p className="mb-6">You'll be redirected to the login page shortly...</p>
        <Button onClick={() => router.push("/login?redirect=/checkout")}>Go to Login</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Delivery Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={deliveryType} onValueChange={setDeliveryType}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  <TabsTrigger value="pickup">Pickup</TabsTrigger>
                </TabsList>

                <TabsContent value="delivery" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Philippines">Philippines</SelectItem>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Calculator for Delivery */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ShippingCalculator address={formData} onShippingChange={setShippingCost} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pickup" className="mt-6">
                  <div className="space-y-6">
                    {/* Pickup Location */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Pickup Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="pickupLocation">Select Branch</Label>
                          <Select
                            value={formData.pickupLocation}
                            onValueChange={(value) => handleInputChange("pickupLocation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a pickup location" />
                            </SelectTrigger>
                            <SelectContent>
                              {pickupLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedLocation && (
                          <>
                            {/* Enhanced Location Details */}
                            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                              <div>
                                <h4 className="font-semibold text-blue-900 mb-2">📍 Branch Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Address:</strong> {selectedLocation.fullAddress}
                                  </p>
                                  <p>
                                    <strong>Landmarks:</strong> {selectedLocation.landmarks}
                                  </p>
                                  <p>
                                    <strong>Hours:</strong> {selectedLocation.hours}
                                  </p>
                                  <p>
                                    <strong>Contact:</strong> {selectedLocation.phone}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {selectedLocation.email}
                                  </p>
                                  <p>
                                    <strong>Parking:</strong> {selectedLocation.parkingInfo}
                                  </p>
                                  <p>
                                    <strong>Contact Person:</strong> {selectedLocation.contactPerson}
                                  </p>
                                </div>
                              </div>

                              <div className="border-t border-blue-200 pt-3">
                                <p className="text-sm text-blue-700">
                                  <strong>About:</strong> {selectedLocation.description}
                                </p>
                              </div>
                            </div>

                            {/* Enhanced Google Maps Integration */}
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Map className="h-5 w-5 text-blue-600" />
                                <h3 className="font-medium text-blue-900">Store Location & Directions</h3>
                              </div>
                              <GoogleMapComponent location={selectedLocation} height="350px" />
                            </div>

                            {/* Pickup Instructions */}
                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-amber-900 mb-2">🚗 Pickup Instructions</h4>
                              <ul className="text-sm text-amber-800 space-y-1">
                                <li>• Park in the designated pickup area in front of the store</li>
                                <li>• Call {selectedLocation.phone} when you arrive</li>
                                <li>• Bring your order confirmation and valid ID</li>
                                <li>• Orders are typically ready within 2-3 hours of confirmation</li>
                                <li>• Free parking available for pickup customers</li>
                              </ul>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Pickup Date and Time */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Pickup Date & Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="pickupDate">Pickup Date</Label>
                          <Input
                            id="pickupDate"
                            type="date"
                            value={formData.pickupDate}
                            onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="pickupTime">Pickup Time</Label>
                          <Select
                            value={formData.pickupTime}
                            onValueChange={(value) => handleInputChange("pickupTime", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Orders are typically ready for pickup within 2-3 hours. We'll send you a confirmation when
                            your order is ready.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>

                    {/* Person Picking Up */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Pickup Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="pickupPersonName">Name of Person Picking Up</Label>
                          <Input
                            id="pickupPersonName"
                            value={formData.pickupPersonName}
                            onChange={(e) => handleInputChange("pickupPersonName", e.target.value)}
                            placeholder="Full name of the person who will pick up the order"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="pickupNotes">Pickup Instructions (Optional)</Label>
                          <Textarea
                            id="pickupNotes"
                            value={formData.pickupNotes}
                            onChange={(e) => handleInputChange("pickupNotes", e.target.value)}
                            placeholder="Any special instructions for pickup (e.g., 'Please pack items separately', 'I'll arrive early')"
                            rows={3}
                          />
                        </div>

                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Please bring your order confirmation email or ID when picking up. If someone else is picking
                            up your order, they should bring a copy of your ID and the order confirmation.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gcash" id="gcash" />
                  <Label htmlFor="gcash">GCash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on {deliveryType === "delivery" ? "Delivery" : "Pickup"}</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "gcash" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="gcashNumber">GCash Number</Label>
                    <Input
                      id="gcashNumber"
                      placeholder="09XX XXX XXXX"
                      value={formData.gcashNumber}
                      onChange={(e) => handleInputChange("gcashNumber", e.target.value)}
                    />
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You will receive a GCash payment request after placing your order. Please complete the payment
                      within 15 minutes to confirm your order.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="orderNotes">Special Instructions</Label>
                <Textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={(e) => handleInputChange("orderNotes", e.target.value)}
                  placeholder="Any special requests or instructions for your order..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {console.log("Image URL for", item.name, ":", item.image_url)}
                      {item.image_url ? (
                        <img
                          src={item.image_url.startsWith("/") ? item.image_url : `/images/${item.image_url}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("Image failed to load:", item.image_url)
                            e.currentTarget.src = getFallbackImage(item.category || "other")
                          }}
                        />
                      ) : (
                        <img
                          src={getFallbackImage(item.category || "other")}
                          alt={`${item.name} - Default image`}
                          className="w-full h-full object-cover opacity-75"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(isNaN(item.price * item.quantity) ? 0 : item.price * item.quantity)}
                  </p>
                </div>
              ))}

              <Separator />

              <CouponForm onDiscountApplied={setDiscount} />

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(isNaN(subtotal) ? 0 : subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{deliveryType === "delivery" ? "Shipping" : "Pickup Fee"}</span>
                  <span>{formatCurrency(isNaN(currentShippingCost) ? 0 : currentShippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12%)</span>
                  <span>{formatCurrency(isNaN(tax) ? 0 : tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(isNaN(discount) ? 0 : discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(isNaN(finalTotal) ? 0 : finalTotal)}</span>
                </div>
              </div>

              {/* Confirmation Summary for Pickup */}
              {deliveryType === "pickup" && selectedLocation && (
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Pickup Confirmation</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Location:</strong> {selectedLocation.name}
                    </p>
                    {formData.pickupDate && (
                      <p>
                        <strong>Date:</strong> {new Date(formData.pickupDate).toLocaleDateString()}
                      </p>
                    )}
                    {formData.pickupTime && (
                      <p>
                        <strong>Time:</strong> {formData.pickupTime}
                      </p>
                    )}
                    {formData.pickupPersonName && (
                      <p>
                        <strong>Pickup Person:</strong> {formData.pickupPersonName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full bg-gold hover:bg-amber-500 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
