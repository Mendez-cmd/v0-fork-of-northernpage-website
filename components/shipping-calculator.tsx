"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

interface ShippingCalculatorProps {
  address: any
  onShippingChange: (cost: number) => void
}

export function ShippingCalculator({ address, onShippingChange }: ShippingCalculatorProps) {
  const [selectedOption, setSelectedOption] = useState("")
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])

  useEffect(() => {
    // Calculate shipping options based on address
    const calculateShipping = () => {
      const baseOptions: ShippingOption[] = [
        {
          id: "standard",
          name: "Standard Delivery",
          description: "Regular delivery service",
          price: 150,
          estimatedDays: "5-7 business days",
        },
        {
          id: "express",
          name: "Express Delivery",
          description: "Faster delivery service",
          price: 300,
          estimatedDays: "2-3 business days",
        },
        {
          id: "overnight",
          name: "Overnight Delivery",
          description: "Next day delivery",
          price: 500,
          estimatedDays: "1 business day",
        },
      ]

      // Adjust prices based on location
      if (address.city && address.state) {
        // Metro Manila - standard rates
        if (address.city.toLowerCase().includes("manila") || address.state.toLowerCase().includes("metro manila")) {
          setShippingOptions(baseOptions)
        }
        // Provincial areas - higher rates
        else {
          const adjustedOptions = baseOptions.map((option) => ({
            ...option,
            price: option.price + 100,
          }))
          setShippingOptions(adjustedOptions)
        }
      } else {
        setShippingOptions(baseOptions)
      }
    }

    calculateShipping()
  }, [address])

  useEffect(() => {
    if (selectedOption) {
      const option = shippingOptions.find((opt) => opt.id === selectedOption)
      onShippingChange(option?.price || 0)
    }
  }, [selectedOption, shippingOptions, onShippingChange])

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        {shippingOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value={option.id} id={option.id} />
            <div className="flex-1">
              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                {option.name}
              </Label>
              <p className="text-sm text-gray-500">{option.description}</p>
              <p className="text-sm text-gray-500">{option.estimatedDays}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(option.price)}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
