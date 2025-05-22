"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data - in a real app, this would come from the database
const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 2800 },
  { name: "May", total: 3600 },
  { name: "Jun", total: 4100 },
  { name: "Jul", total: 4700 },
  { name: "Aug", total: 5200 },
  { name: "Sep", total: 4800 },
  { name: "Oct", total: 5500 },
  { name: "Nov", total: 6500 },
  { name: "Dec", total: 7500 },
]

export function SalesSummary() {
  const [period, setPeriod] = useState("yearly")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Sales Trend</h4>
          <p className="text-sm text-muted-foreground">
            {period === "yearly" ? "Annual" : period === "monthly" ? "Monthly" : "Weekly"} sales overview
          </p>
        </div>
        <div className="ml-auto mr-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} />
          <Tooltip formatter={(value) => [`₱${value}`, "Revenue"]} labelFormatter={(label) => `Month: ${label}`} />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
