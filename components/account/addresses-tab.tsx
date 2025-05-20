"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Plus, MapPin, Home, Building, Trash2, PenSquare } from "lucide-react"

interface AddressesTabProps {
  userId: string
}

export function AddressesTab({ userId }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  const supabase = createClient()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    address_name: "",
    recipient_name: "",
    street_address: "",
    apartment: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Philippines",
    phone: "",
    is_default: false,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false })

        if (error) throw error

        setAddresses(data || [])
      } catch (error) {
        console.error("Error fetching addresses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [userId, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setFormData({
      address_name: "",
      recipient_name: "",
      street_address: "",
      apartment: "",
      city: "",
      province: "",
      postal_code: "",
      country: "Philippines",
      phone: "",
      is_default: false,
    })
    setShowAddressModal(true)
  }

  const handleEditAddress = (address: any) => {
    setEditingAddress(address)
    setFormData({
      address_name: address.address_name || "",
      recipient_name: address.recipient_name || "",
      street_address: address.street_address || "",
      apartment: address.apartment || "",
      city: address.city || "",
      province: address.province || "",
      postal_code: address.postal_code || "",
      country: address.country || "Philippines",
      phone: address.phone || "",
      is_default: address.is_default || false,
    })
    setShowAddressModal(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const { error } = await supabase.from("addresses").delete().eq("id", addressId)

      if (error) throw error

      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))

      toast({
        title: "Address deleted",
        description: "Your address has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete address. Please try again.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // If setting as default, update all other addresses to not be default
      if (formData.is_default) {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId)
      }

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from("addresses")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAddress.id)

        if (error) throw error

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id
              ? { ...addr, ...formData, updated_at: new Date().toISOString() }
              : formData.is_default
                ? { ...addr, is_default: false }
                : addr,
          ),
        )

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        })
      } else {
        // Add new address
        const { data, error } = await supabase
          .from("addresses")
          .insert({
            ...formData,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error

        setAddresses((prev) => {
          const newAddresses = formData.is_default ? prev.map((addr) => ({ ...addr, is_default: false })) : [...prev]

          return [data[0], ...newAddresses]
        })

        toast({
          title: "Address added",
          description: "Your address has been added successfully.",
        })
      }

      setShowAddressModal(false)
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save address. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">My Addresses</h2>
          <p className="text-gray-600">Manage your delivery addresses.</p>
        </div>
        <Button onClick={handleAddAddress} className="bg-gold hover:bg-amber-500 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white border rounded-lg p-6 relative">
              {address.is_default && (
                <span className="absolute top-4 right-4 bg-gold text-black text-xs font-medium px-2 py-1 rounded">
                  Default
                </span>
              )}

              <div className="flex items-start mb-4">
                <div className="bg-gray-100 p-2 rounded-full mr-4">
                  {address.address_name?.toLowerCase().includes("home") ? (
                    <Home className="h-5 w-5 text-gray-600" />
                  ) : address.address_name?.toLowerCase().includes("office") ||
                    address.address_name?.toLowerCase().includes("work") ? (
                    <Building className="h-5 w-5 text-gray-600" />
                  ) : (
                    <MapPin className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{address.address_name || "Address"}</h3>
                  <p className="text-gray-700 font-medium">{address.recipient_name}</p>
                </div>
              </div>

              <div className="space-y-1 text-gray-600 mb-6">
                <p>{address.street_address}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>
                  {address.city}, {address.province} {address.postal_code}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>Phone: {address.phone}</p>}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)}>
                  <PenSquare className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-500 mb-6">You haven't added any addresses yet.</p>
          <Button onClick={handleAddAddress} className="bg-gold hover:bg-amber-500 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      )}

      {/* Address Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="address_name">Address Name</Label>
              <Input
                id="address_name"
                name="address_name"
                value={formData.address_name}
                onChange={handleChange}
                placeholder="e.g. Home, Office"
              />
            </div>

            <div>
              <Label htmlFor="recipient_name">Recipient Name</Label>
              <Input
                id="recipient_name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                placeholder="Full name of recipient"
                required
              />
            </div>

            <div>
              <Label htmlFor="street_address">Street Address</Label>
              <Input
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="Street address or P.O. Box"
                required
              />
            </div>

            <div>
              <Label htmlFor="apartment">Apartment, Suite, Unit, etc. (optional)</Label>
              <Input
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Input id="province" name="province" value={formData.province} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_default: !!checked }))}
              />
              <Label htmlFor="is_default">Set as default address</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddressModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gold hover:bg-amber-500 text-black" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
