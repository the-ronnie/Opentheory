"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, Home, LifeBuoy, LogOut, Menu, Search, User, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

// Mock authentication state
const useAuth = () => {
  // In a real app, this would be a proper auth hook
  return {
    isAuthenticated: false, // Set to false to show unauthenticated view
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
  }
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Routes for authenticated users
  const authenticatedRoutes = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    {
      name: "Job Seekers",
      path: "/job-seekers",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <LifeBuoy className="h-4 w-4 mr-2" />,
    },
  ]

  // Routes for unauthenticated users
  const unauthenticatedRoutes = [
    {
      name: "Pricing",
      path: "/pricing",
      icon: null,
    }
  ]

  // Choose routes based on authentication state
  const routes = isAuthenticated ? authenticatedRoutes : unauthenticatedRoutes

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center font-bold text-xl mr-6">
          <div className="h-9 w-9 rounded-md bg-blue-600 flex items-center justify-center mr-2">
            <Code className="h-5 w-5 text-white" />
          </div>
          OpenTheory
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                pathname === route.path ? "text-primary" : "text-muted-foreground",
              )}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Theme Toggle (Desktop) */}
        <div className="hidden md:flex">
          <ThemeToggle />
        </div>

        {/* User Menu (Desktop) */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/profile">My Account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-in">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Simple Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container py-4">
            <nav className="flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center py-2",
                    pathname === route.path ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
              
              <div className="h-px w-full bg-border/60 my-2" />
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </Link>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-destructive flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar