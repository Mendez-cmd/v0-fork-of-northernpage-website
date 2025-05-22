"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Sample data - in a real app, this would come from the database
const data = [
  { name: "New Customers", value: 120, color: "#8884d8" },
  { name: "Returning Customers", value: 280, color: "#82ca9d" },
  { name: "Inactive Customers", value: 50, color: "#ffc658" },
]

export function CustomerActivity() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Customer Segments</h4>
          <p className="text-sm text-muted-foreground">
            {period === "yearly" ? "Annual" : period === "monthly" ? "Monthly" : "Weekly"} customer activity
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

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} customers`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
