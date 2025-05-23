"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Settings,
  Package,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Menu,
  ChevronLeft,
  LogOut,
  Home,
  Search,
  Bell,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Suspense } from "react"

// Navigation items configuration
const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders", badge: "3" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

// Mobile bottom navigation items
const mobileNavItems = [
  { href: "/admin/dashboard", icon: Home, label: "Home" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders", badge: "3" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
]

function AdminSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/images/Nothernchefslogo.png"
              alt="Northern Chefs Logo"
              width={120}
              height={48}
              className="h-8 w-auto"
              priority
            />
          </Link>
        )}
        {collapsed && (
          <Link href="/admin/dashboard" className="flex items-center justify-center w-full">
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
              N
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1", collapsed ? "mx-auto" : "ml-auto")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-colors",
                collapsed ? "justify-center p-3" : "px-4 py-3",
                active
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3 flex-1">{item.label}</span>}
              {!collapsed && item.badge && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
              {collapsed && item.badge && (
                <Badge
                  variant="destructive"
                  className="absolute top-0 right-0 w-4 h-4 p-0 text-[10px] flex items-center justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        {/* View Store Link - with separator */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <Link
            href="/"
            className={cn(
              "flex items-center rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              collapsed ? "justify-center p-3" : "px-4 py-3",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {!collapsed && <span className="ml-3">View Store</span>}
          </Link>
        </div>
      </nav>
    </aside>
  )
}

function AdminHeader({
  collapsed,
  setCollapsed,
  setMobileMenuOpen,
}: {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  setMobileMenuOpen: (value: boolean) => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()
  const isMobile = useMobile()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      })
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    }
  }

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "Admin"
    if (user.user_metadata?.first_name) return user.user_metadata.first_name
    if (user.user_metadata?.name) return user.user_metadata.name.split(" ")[0]
    if (user.email) return user.email.split("@")[0]
    return "Admin"
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 bg-white border-b border-gray-200 h-16 transition-all duration-300",
        isMobile ? "left-0" : collapsed ? "left-[70px]" : "left-[240px]",
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left section - Toggle and Title */}
        <div className="flex items-center">
          {isMobile ? (
            <Button variant="ghost" size="sm" className="mr-3" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="mr-3 md:hidden" onClick={() => setCollapsed(!collapsed)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          </div>
        </div>

        {/* Right section - Search, Notifications, User */}
        <div className="flex items-center space-x-4">
          {/* Search - only on larger screens */}
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-10 w-56 bg-gray-50 border-gray-200" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-medium">2</span>
            </div>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-1">
                <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-medium">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block ml-2">{getUserDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start p-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-medium mr-3">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{getUserDisplayName()}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[180px]">{user?.email}</span>
                </div>
              </div>
              <div className="p-2">
                <DropdownMenuItem asChild className="rounded-md py-2">
                  <Link href="/account" className="cursor-pointer w-full">
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-md py-2">
                  <Link href="/admin/settings" className="cursor-pointer w-full">
                    Admin Settings
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 rounded-md py-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center" onClick={() => setIsOpen(false)}>
            <Image
              src="/images/Nothernchefslogo.png"
              alt="Northern Chefs Logo"
              width={120}
              height={48}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  active
                    ? "bg-amber-50 text-amber-700 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3 flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}

          {/* View Store Link - with separator */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center px-4 py-3 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="ml-3">View Store</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full px-2",
                active ? "text-amber-600" : "text-gray-500",
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">{item.badge}</span>
                  </div>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  // On mobile, sidebar is collapsed by default
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      <Suspense fallback={null}>
        <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      </Suspense>

      {/* Sidebar - hidden on mobile */}
      {!isMobile && (
        <Suspense fallback={null}>
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Suspense>
      )}

      {/* Header */}
      <Suspense fallback={null}>
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} setMobileMenuOpen={setMobileMenuOpen} />
      </Suspense>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-16 pb-20 transition-all duration-300 md:pb-8",
          isMobile ? "ml-0" : collapsed ? "ml-[70px]" : "ml-[240px]",
        )}
      >
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </div>
  )
}
