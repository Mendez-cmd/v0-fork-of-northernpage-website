"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Settings, Package, Users, ShoppingCart, BarChart3, LogOut, ChevronDown, Eye, Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

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

  const isActive = (path: string) => {
    return pathname === path
  }

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "Admin"

    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }

    if (user.user_metadata?.name) {
      return user.user_metadata.name.split(" ")[0]
    }

    if (user.email) {
      return user.email.split("@")[0]
    }

    return "Admin"
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-amber-500/20 sticky top-0 z-50 shadow-xl">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Admin Badge */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/Nothernchefslogo.png"
                alt="Northern Chefs Logo"
                width={120}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1 shadow-lg"
              >
                <Shield className="h-3 w-3 mr-1" />
                ADMIN MODE
              </Badge>
              <div className="h-6 w-px bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">System Online</span>
              </div>
            </div>
          </div>

          {/* Admin Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "hover:bg-slate-800/50 hover:text-amber-400"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive("/admin/products")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "hover:bg-slate-800/50 hover:text-amber-400"
              }`}
            >
              <Package className="h-4 w-4" />
              <span className="font-medium">Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive("/admin/orders")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "hover:bg-slate-800/50 hover:text-amber-400"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">Orders</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs ml-1">
                3
              </Badge>
            </Link>

            <Link
              href="/admin/customers"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive("/admin/customers")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                  : "hover:bg-slate-800/50 hover:text-amber-400"
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">Customers</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-amber-400 transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Settings</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
                <DropdownMenuItem asChild>
                  <Link href="/admin/categories" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/promotions" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    Promotions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/reviews" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    Reviews
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/inventory" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    Inventory
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild>
                  <Link href="/admin/setup" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    System Setup
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <Bell className="h-5 w-5 text-slate-300 hover:text-amber-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </Button>

            {/* View as Customer Button */}
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-200 rounded-xl"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Button>
            </Link>

            {/* Admin User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 hover:bg-slate-800/50 rounded-xl p-2 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-white">{getUserDisplayName()}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[120px]">{user?.email}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-slate-800 border-slate-700">
                <div className="flex items-center justify-start p-3 border-b border-slate-700">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{getUserDisplayName()}</span>
                    <span className="text-sm text-slate-400 truncate max-w-[180px]">{user?.email}</span>
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs mt-1 w-fit"
                    >
                      Administrator
                    </Badge>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/setup" className="cursor-pointer w-full text-slate-200 hover:text-amber-400">
                    Admin Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Admin Menu */}
        <div className="lg:hidden mt-6 pt-6 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-2 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive("/admin/dashboard")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400"
                  : "hover:bg-slate-800/50 hover:text-amber-400 text-slate-300"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center space-x-2 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive("/admin/products")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400"
                  : "hover:bg-slate-800/50 hover:text-amber-400 text-slate-300"
              }`}
            >
              <Package className="h-4 w-4" />
              <span className="font-medium">Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center space-x-2 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive("/admin/orders")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400"
                  : "hover:bg-slate-800/50 hover:text-amber-400 text-slate-300"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">Orders</span>
            </Link>

            <Link
              href="/admin/customers"
              className={`flex items-center space-x-2 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive("/admin/customers")
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400"
                  : "hover:bg-slate-800/50 hover:text-amber-400 text-slate-300"
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">Customers</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
