"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, X, Home, Package, Phone, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Logo animation keyframes
const logoAnimationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .logo-pulse {
    animation: pulse 3s infinite ease-in-out;
  }
`

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const pathname = usePathname()
  const { items } = useCart()
  const { toast } = useToast()
  const supabase = createClient()
  const isMobile = useMobile()
  const { scrollDirection, isAtTop } = useScrollDirection()
  const { user, isAdmin } = useAuth()

  // Check if we're in an admin page
  const isAdminPage = pathname?.startsWith("/admin")

  // Determine if the header should be visible
  const shouldShowHeader = scrollDirection === "up" || isAtTop || isMobileMenuOpen

  // Add the animation styles to the document
  useEffect(() => {
    // Check if the style element already exists
    if (!document.getElementById("logo-animation-styles")) {
      const styleElement = document.createElement("style")
      styleElement.id = "logo-animation-styles"
      styleElement.innerHTML = logoAnimationStyles
      document.head.appendChild(styleElement)

      // Clean up on unmount
      return () => {
        const existingStyle = document.getElementById("logo-animation-styles")
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setIsLoggedIn(!!session)

      if (session?.user) {
        setUserData(session.user)
      }

      setIsLoading(false)
    }

    checkUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        setUserData(session.user)
      } else {
        setUserData(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

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
      setIsLoggedIn(false)
      setUserData(null)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Prevent scrolling when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = "auto"
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Get user's first name or email prefix
  const getUserDisplayName = () => {
    if (!userData) return ""

    // Try to get name from metadata
    if (userData.user_metadata?.first_name) {
      return userData.user_metadata.first_name
    }

    if (userData.user_metadata?.name) {
      return userData.user_metadata.name.split(" ")[0]
    }

    // Fall back to email prefix
    if (userData.email) {
      return userData.email.split("@")[0]
    }

    return "User"
  }

  // Get user's profile picture
  const getProfilePicture = () => {
    if (!userData) return null

    return userData.user_metadata?.profile_picture || null
  }

  // If we're in an admin page, don't render navigation at all
  if (isAdminPage) {
    return null
  }

  return (
    <>
      <header
        className={cn(
          "bg-custom-dark text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:block",
          shouldShowHeader ? "translate-y-0 shadow-md" : "-translate-y-full shadow-none",
          isAtTop ? "py-4" : "py-2",
        )}
      >
        <nav className="container mx-auto px-4 flex items-center justify-between">
          {/* Desktop Navigation Links - Left Side */}
          <ul className="hidden lg:flex items-center space-x-8">
            <li>
              <Link href="/" className={`hover:text-gold transition-colors ${isActive("/") ? "text-gold" : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`hover:text-gold transition-colors ${isActive("/products") ? "text-gold" : ""}`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                className={`hover:text-gold transition-colors ${isActive("/order") ? "text-gold" : ""}`}
              >
                Order
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`hover:text-gold transition-colors ${isActive("/contact") ? "text-gold" : ""}`}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Logo - Center */}
          <div className="logo flex-shrink-0 animate-fadeIn">
            <Link href="/">
              <div className="logo-container overflow-hidden relative group">
                <Image
                  src="/images/Nothernchefslogo.png"
                  alt="Northern Chefs Logo"
                  width={isMobile ? 120 : 150}
                  height={isMobile ? 48 : 60}
                  className={`h-auto transition-all duration-500 transform group-hover:scale-105 ${
                    !isAtTop && !isMobile ? "w-32" : ""
                  } ${isAtTop ? "logo-pulse" : ""}`}
                  priority
                />
                <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
              </div>
            </Link>
          </div>

          {/* Desktop User Actions - Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gold">Hello, {getUserDisplayName()}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:text-gold relative">
                          {getProfilePicture() ? (
                            <Image
                              src={getProfilePicture() || "/placeholder.svg"}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="rounded-full w-8 h-8 object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center justify-start p-2">
                          {getProfilePicture() ? (
                            <Image
                              src={getProfilePicture() || "/placeholder.svg"}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="rounded-full w-8 h-8 object-cover mr-2"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black mr-2">
                              {getUserDisplayName().charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">{getUserDisplayName()}</span>
                            <span className="text-xs text-gray-500 truncate max-w-[180px]">{userData?.email}</span>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="cursor-pointer w-full">
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account?tab=orders" className="cursor-pointer w-full">
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account?tab=addresses" className="cursor-pointer w-full">
                            Addresses
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account?tab=wishlist" className="cursor-pointer w-full">
                            Wishlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account?tab=reviews" className="cursor-pointer w-full">
                            Reviews
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account?tab=settings" className="cursor-pointer w-full">
                            Account Settings
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href="/admin/dashboard"
                                className="cursor-pointer w-full text-amber-600 font-medium"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Admin Dashboard
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className={`text-white hover:text-gold ${isActive("/login") ? "text-gold" : ""}`}
                      >
                        Log-in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        variant="ghost"
                        className={`text-white hover:text-gold ${isActive("/register") ? "text-gold" : ""}`}
                      >
                        Sign-up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            <Link href="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-gold ${isActive("/cart") ? "text-gold" : ""}`}
              >
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-custom-dark bg-opacity-95 z-50 lg:hidden overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <Link href="/" onClick={closeMobileMenu}>
                  <Image
                    src="/images/Nothernchefslogo.png"
                    alt="Northern Chefs Logo"
                    width={120}
                    height={48}
                    className="h-10 w-auto"
                  />
                </Link>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="text-white hover:text-gold">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="p-4">
                {isLoggedIn && (
                  <div className="flex items-center mb-6 p-4 bg-gray-900 rounded-lg">
                    {getProfilePicture() ? (
                      <Image
                        src={getProfilePicture() || "/placeholder.svg"}
                        alt="Profile"
                        width={60}
                        height={60}
                        className="rounded-full w-14 h-14 object-cover mr-4"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-black mr-4 text-xl font-bold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xl text-gold">Hello, {getUserDisplayName()}</div>
                      <div className="text-sm text-gray-400 truncate max-w-[200px]">{userData?.email}</div>
                    </div>
                  </div>
                )}

                <nav className="space-y-6">
                  <div>
                    <h3 className="text-gray-400 uppercase text-sm font-semibold mb-3">Menu</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/"
                          className={`flex items-center text-lg hover:text-gold transition-colors ${
                            isActive("/") ? "text-gold" : ""
                          }`}
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🏠</span>
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products"
                          className={`flex items-center text-lg hover:text-gold transition-colors ${
                            isActive("/products") ? "text-gold" : ""
                          }`}
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🍲</span>
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/order"
                          className={`flex items-center text-lg hover:text-gold transition-colors ${
                            isActive("/order") ? "text-gold" : ""
                          }`}
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🛒</span>
                          Order
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className={`flex items-center text-lg hover:text-gold transition-colors ${
                            isActive("/contact") ? "text-gold" : ""
                          }`}
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">📞</span>
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {isLoggedIn ? (
                    <div>
                      <h3 className="text-gray-400 uppercase text-sm font-semibold mb-3">Account</h3>
                      <ul className="space-y-4">
                        <li>
                          <Link
                            href="/account"
                            className="flex items-center text-lg hover:text-gold transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <span className="mr-2">👤</span>
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account?tab=orders"
                            className="flex items-center text-lg hover:text-gold transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <span className="mr-2">📦</span>
                            My Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account?tab=wishlist"
                            className="flex items-center text-lg hover:text-gold transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <span className="mr-2">❤️</span>
                            Wishlist
                          </Link>
                        </li>
                        {isAdmin && (
                          <div>
                            <h3 className="text-gray-400 uppercase text-sm font-semibold mb-3">Admin</h3>
                            <ul className="space-y-4">
                              <li>
                                <Link
                                  href="/admin/dashboard"
                                  className="flex items-center text-lg text-amber-500 hover:text-amber-400 font-medium"
                                  onClick={closeMobileMenu}
                                >
                                  <span className="mr-2">⚙️</span>
                                  Admin Dashboard
                                </Link>
                              </li>
                            </ul>
                          </div>
                        )}
                        <li>
                          <Button
                            variant="ghost"
                            className="flex items-center text-lg text-red-500 hover:text-red-400 p-0"
                            onClick={() => {
                              handleLogout()
                              closeMobileMenu()
                            }}
                          >
                            <span className="mr-2">🚪</span>
                            Logout
                          </Button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-gray-400 uppercase text-sm font-semibold mb-3">Account</h3>
                      <ul className="space-y-4">
                        <li>
                          <Link
                            href="/login"
                            className="flex items-center text-lg hover:text-gold transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <span className="mr-2">🔑</span>
                            Log-in
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/register"
                            className="flex items-center text-lg hover:text-gold transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <span className="mr-2">✏️</span>
                            Sign-up
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="text-gray-400 uppercase text-sm font-semibold mb-3">Categories</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/products?category=chicken-pastel"
                          className="flex items-center text-lg hover:text-gold transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🍗</span>
                          Chicken Pastil
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products?category=laing"
                          className="flex items-center text-lg hover:text-gold transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🌿</span>
                          Laing
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products?category=bangus"
                          className="flex items-center text-lg hover:text-gold transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🐟</span>
                          Spanish Bangus
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products?category=chili"
                          className="flex items-center text-lg hover:text-gold transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <span className="mr-2">🌶️</span>
                          Chili Garlic
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <Link href="/cart" onClick={closeMobileMenu}>
                    <Button className="w-full bg-gold hover:bg-amber-500 text-black flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      View Cart ({items.length} items)
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden">
        <nav className="fixed bottom-0 left-0 right-0 bg-custom-dark border-t border-gray-800 z-40">
          <div className="flex justify-around items-center py-2">
            <Link
              href="/"
              className={`flex flex-col items-center p-2 ${isActive("/") ? "text-gold" : "text-gray-400"}`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href="/products"
              className={`flex flex-col items-center p-2 ${isActive("/products") ? "text-gold" : "text-gray-400"}`}
            >
              <Package className="h-6 w-6" />
              <span className="text-xs mt-1">Products</span>
            </Link>
            <Link
              href="/cart"
              className={`flex flex-col items-center p-2 relative ${isActive("/cart") ? "text-gold" : "text-gray-400"}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </Link>
            <Link
              href="/contact"
              className={`flex flex-col items-center p-2 ${isActive("/contact") ? "text-gold" : "text-gray-400"}`}
            >
              <Phone className="h-6 w-6" />
              <span className="text-xs mt-1">Contact</span>
            </Link>
            <Link
              href="/account"
              className={`flex flex-col items-center p-2 ${isActive("/account") ? "text-gold" : "text-gray-400"}`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Account</span>
            </Link>
          </div>
        </nav>

        {/* Add padding to the bottom of the page to account for the bottom navigation */}
        <div className="h-16"></div>
      </div>
    </>
  )
}
