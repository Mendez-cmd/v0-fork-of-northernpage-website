import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import LayoutWithProviders from "./layout-with-providers"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Northern Chefs - Authentic Filipino Cuisine",
  description: "Handcrafted Filipino dishes delivered to your doorstep",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWithProviders>{children}</LayoutWithProviders>
      </body>
    </html>
  )
}
