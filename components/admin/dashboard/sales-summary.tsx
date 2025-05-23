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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Sales Trend</h4>
          <p className="text-sm text-muted-foreground">
            {period === "yearly" ? "Annual" : period === "monthly" ? "Monthly" : "Weekly"} sales overview
          </p>
        </div>
        <div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
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

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `₱${value}`}
              dx={-10}
            />
            <Tooltip
              formatter={(value) => [`₱${value}`, "Revenue"]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#d97706"
              strokeWidth={3}
              dot={{ r: 4, fill: "#d97706", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#d97706", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
