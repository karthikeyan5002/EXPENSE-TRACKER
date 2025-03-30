"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { Search, Plus, User, LogOut, Sun, Moon, LayoutDashboard, PieChart, ListPlus, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

type DashboardLayoutProps = {
  children: React.ReactNode
  currentPage: string
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [isSearching, setIsSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    // Apply theme class to document
    if (theme === "dark") {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }

  // Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching)
    if (isSearching) {
      setSearchTerm("")
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard" },
    { name: "Add Expense", icon: <ListPlus className="h-5 w-5" />, path: "/add-expense" },
    { name: "Analytics", icon: <PieChart className="h-5 w-5" />, path: "/analytics" },
    { name: "Profile", icon: <User className="h-5 w-5" />, path: "/profile" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ]

  // Ensure dark mode is applied on initial render
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark")
  }, [])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} ${theme === "dark" ? "text-white" : "text-gray-900"}`}
    >
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

      {/* Header */}
      <header
        className={`sticky top-0 z-10 backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/70 border-b border-gray-700" : "bg-white/70 border-b border-gray-200"}`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-wallet h-6 w-6 text-blue-400"
            >
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
            </svg>
            <h1 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              ExpenseTracker
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isSearching ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "200px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                >
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search expenses..."
                    className={`pl-8 h-9 ${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-gray-100 border-gray-200 text-gray-900"} placeholder:text-gray-500`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${theme === "dark" ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}
              onClick={toggleSearch}
            >
              {isSearching ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">{isSearching ? "Close search" : "Search"}</span>
            </Button>
            <Button
              size="sm"
              className={`rounded-full gap-1 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600" : "bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300"}`}
              onClick={() => router.push("/add-expense")}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 border-2 border-gray-700 bg-gray-800 cursor-pointer">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-gray-700 text-white">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white">
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden md:block w-64 min-h-[calc(100vh-4rem)] ${theme === "dark" ? "bg-gray-800/50 border-r border-gray-700" : "bg-white/80 border-r border-gray-200"} backdrop-blur-md`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      currentPage === item.name.toLowerCase()
                        ? theme === "dark"
                          ? "bg-gray-700/70 text-white"
                          : "bg-gray-200/70 text-gray-900"
                        : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          : "text-gray-700 hover:bg-gray-200/50 hover:text-gray-900"
                    }`}
                    onClick={() => router.push(item.path)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden fixed bottom-6 right-6 z-20 p-3 rounded-full shadow-lg ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <LayoutDashboard className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`md:hidden fixed bottom-20 right-6 z-10 p-2 rounded-lg shadow-lg ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <nav>
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start ${
                          currentPage === item.name.toLowerCase()
                            ? theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-200 text-gray-900"
                            : ""
                        }`}
                        onClick={() => {
                          router.push(item.path)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}

