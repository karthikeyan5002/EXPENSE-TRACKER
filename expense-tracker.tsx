"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  MoreHorizontal,
  PieChart,
  CreditCard,
  Home,
  ShoppingBag,
  Car,
  Film,
  Utensils,
  Zap,
  User,
  LogOut,
  Edit2,
  Check,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "./auth-context"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Define expense type
type Expense = {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

// Define category type with color
type Category = {
  name: string
  color: string
  icon: React.ReactNode
}

// Define chart type
type ChartType = "radar" | "bar" | "pie" | "area" | "scatter" | "line" | "stream"

type ExpenseTrackerProps = {
  navigateToProfile: () => void
  monthlySalary: number
  userName: string
  userProfilePicture?: string
}

export default function ExpenseTracker({
  navigateToProfile,
  monthlySalary,
  userName,
  userProfilePicture,
}: ExpenseTrackerProps) {
  const { logout, updateUser } = useAuth()

  // Sample categories with colors and icons
  const categories: Category[] = [
    { name: "Food", color: "bg-blue-500/80", icon: <Utensils className="h-4 w-4" /> },
    { name: "Transport", color: "bg-green-500/80", icon: <Car className="h-4 w-4" /> },
    { name: "Shopping", color: "bg-pink-500/80", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Bills", color: "bg-yellow-500/80", icon: <Zap className="h-4 w-4" /> },
    { name: "Entertainment", color: "bg-orange-500/80", icon: <Film className="h-4 w-4" /> },
    { name: "Other", color: "bg-purple-500/80", icon: <Home className="h-4 w-4" /> },
  ]

  // State for expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      amount: 4599,
      description: "Grocery Shopping",
      category: "Food",
      date: "2025-03-05",
    },
    {
      id: "2",
      amount: 1250,
      description: "Bus Ticket",
      category: "Transport",
      date: "2025-03-04",
    },
    {
      id: "3",
      amount: 8999,
      description: "New Shoes",
      category: "Shopping",
      date: "2025-03-03",
    },
    {
      id: "4",
      amount: 15000,
      description: "Electricity Bill",
      category: "Bills",
      date: "2025-03-06",
    },
    {
      id: "5",
      amount: 3500,
      description: "Movie Tickets",
      category: "Entertainment",
      date: "2025-03-07",
    },
    {
      id: "6",
      amount: 2500,
      description: "Internet Bill",
      category: "Bills",
      date: "2025-03-10",
    },
    {
      id: "7",
      amount: 6000,
      description: "Restaurant Dinner",
      category: "Food",
      date: "2025-03-12",
    },
    {
      id: "8",
      amount: 3000,
      description: "Fuel",
      category: "Transport",
      date: "2025-03-15",
    },
    {
      id: "9",
      amount: 12000,
      description: "Clothes Shopping",
      category: "Shopping",
      date: "2025-03-18",
    },
    {
      id: "10",
      amount: 5000,
      description: "Concert Tickets",
      category: "Entertainment",
      date: "2025-03-20",
    },
  ])

  // State for new expense
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  })

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [editingSalary, setEditingSalary] = useState(false)
  const [tempSalary, setTempSalary] = useState(monthlySalary.toString())
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("bar")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories.map((c) => c.name))
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate profit/loss
  const profitLoss = monthlySalary - totalExpenses
  const isProfitable = profitLoss >= 0

  // Filter expenses based on search, category, and active tab
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "All" || expense.category === filterCategory

    // Filter by time period if needed
    const expenseDate = new Date(expense.date)
    const today = new Date()
    const isToday = expenseDate.toDateString() === today.toDateString()
    const isThisWeek = expenseDate >= new Date(today.setDate(today.getDate() - today.getDay()))
    const isThisMonth =
      expenseDate.getMonth() === new Date().getMonth() && expenseDate.getFullYear() === new Date().getFullYear()

    let matchesTab = true
    if (activeTab === "today") matchesTab = isToday
    else if (activeTab === "week") matchesTab = isThisWeek
    else if (activeTab === "month") matchesTab = isThisMonth

    return matchesSearch && matchesCategory && matchesTab
  })

  // Group expenses by category for summary
  const expensesByCategory = categories
    .map((category) => {
      const total = expenses
        .filter((expense) => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0)
      return {
        ...category,
        total,
      }
    })
    .sort((a, b) => b.total - a.total)

  // Filter expenses by selected categories
  const filteredBySelectedCategories = expenses.filter((expense) => selectedCategories.includes(expense.category))

  // Prepare data for charts
  const prepareChartData = () => {
    // For category-based charts (bar, pie, radar)
    const categoryData = categories
      .filter((category) => selectedCategories.includes(category.name))
      .map((category) => {
        const total = expenses
          .filter((expense) => expense.category === category.name)
          .reduce((sum, expense) => sum + expense.amount, 0)

        return {
          name: category.name,
          value: total,
          color: category.color.replace("bg-", "").replace("/80", ""),
        }
      })
      .filter((item) => item.value > 0)

    // For time-based charts (area, line, stream)
    const dateMap = new Map<string, Record<string, number>>()

    filteredBySelectedCategories.forEach((expense) => {
      const date = formatDate(expense.date)
      if (!dateMap.has(date)) {
        dateMap.set(date, {})
      }

      const dateData = dateMap.get(date)!
      if (dateData[expense.category]) {
        dateData[expense.category] += expense.amount
      } else {
        dateData[expense.category] = expense.amount
      }
    })

    const timeData = Array.from(dateMap.entries())
      .map(([date, categories]) => ({
        date,
        ...categories,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // For scatter plot
    const scatterData = filteredBySelectedCategories.map((expense) => ({
      x: new Date(expense.date).getTime(),
      y: expense.amount,
      category: expense.category,
      description: expense.description,
    }))

    return {
      categoryData,
      timeData,
      scatterData,
    }
  }

  const { categoryData, timeData, scatterData } = prepareChartData()

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.description) return

    const expense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      date: newExpense.date,
    }

    setExpenses([expense, ...expenses])
    setNewExpense({
      amount: "",
      description: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
    })
    setIsAddExpenseOpen(false)
  }

  // Handle deleting an expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Handle saving salary
  const handleSaveSalary = () => {
    const newSalary = Number.parseFloat(tempSalary)
    if (!isNaN(newSalary) && newSalary >= 0) {
      updateUser({ monthlySalary: newSalary })
    }
    setEditingSalary(false)
  }

  // Handle category selection
  const handleCategorySelection = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching)
    if (!isSearching) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchTerm("")
    }
  }

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

  // Handle clearing all expenses
  const handleClearExpenses = () => {
    if (confirm("Are you sure you want to clear all expenses? This action cannot be undone.")) {
      setExpenses([])
    }
  }

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category ? category.color : "bg-gray-500/80"
  }

  // Get category color without bg- prefix
  const getCategoryColorValue = (categoryName: string) => {
    const bgColor = getCategoryColor(categoryName)
    return bgColor.replace("bg-", "").replace("/80", "")
  }

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category ? category.icon : <CreditCard className="h-4 w-4" />
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Render chart based on selected type
  const renderChart = () => {
    const chartColor = "#2268D1" // Use the requested color
    const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    const textColor = theme === "dark" ? "#aaa" : "#666"
    const tooltipStyle =
      theme === "dark"
        ? {
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            color: "#fff",
          }
        : {
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            color: "#333",
          }

    switch (selectedChartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [formatCurrency(value as number), "Amount"]}
                cursor={{ fill: "rgba(34, 104, 209, 0.1)" }}
              />
              <Bar dataKey="value" name="Amount" fill={chartColor} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill={chartColor}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(210, 73%, ${40 + index * 5}%)`} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} contentStyle={tooltipStyle} />
            </RechartsPieChart>
          </ResponsiveContainer>
        )

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius={100} data={categoryData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="name" stroke={textColor} />
              <PolarRadiusAxis stroke={textColor} />
              <Radar name="Expenses" dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.6} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value as number), ""]} />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fill={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value as number), ""]} />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={`hsl(210, 73%, ${40 + index * 5}%)`}
                  strokeWidth={2}
                  dot={{ fill: `hsl(210, 73%, ${40 + index * 5}%)`, r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number"
                dataKey="x"
                name="Date"
                stroke={textColor}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(tick) => formatDate(new Date(tick).toISOString().split("T")[0])}
              />
              <YAxis type="number" dataKey="y" name="Amount" stroke={textColor} tickFormatter={(tick) => `₹${tick}`} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={tooltipStyle}
                formatter={(value, name, props) => {
                  if (name === "y") {
                    return [formatCurrency(value as number), "Amount"]
                  }
                  if (name === "x") {
                    return [formatDate(new Date(value as number).toISOString().split("T")[0]), "Date"]
                  }
                  return [value, name]
                }}
              />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Scatter
                  key={category}
                  name={category}
                  data={scatterData.filter((d) => d.category === category)}
                  fill={`hsl(210, 73%, ${40 + index * 5}%)`}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )

      case "stream":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value as number), ""]} />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fill={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            Select a chart type to visualize your expenses
          </div>
        )
    }
  }

  // Ensure dark mode is applied on initial render
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark")
  }, [])

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
            <Wallet className="h-6 w-6 text-blue-400" />
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
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search expenses..."
                    className="pl-8 h-9 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
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
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className={`rounded-full gap-1 ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600" : "bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300"}`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Expense</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800/90 backdrop-blur-xl border border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount" className="text-gray-300">
                      Amount (₹)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      className="bg-gray-700/50 border-gray-600 text-white"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="What did you spend on?"
                      className="bg-gray-700/50 border-gray-600 text-white"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-gray-300">
                      Category
                    </Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger id="category" className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white">
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date" className="text-gray-300">
                      Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-9 bg-gray-700/50 border-gray-600 text-white"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddExpense}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    Add Expense
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 border-2 border-gray-700 bg-gray-800 cursor-pointer">
                  <AvatarImage src={userProfilePicture} alt={userName} />
                  <AvatarFallback className="bg-gray-700 text-white">{getInitials(userName)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white">
                <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
              <Card
                className={`overflow-hidden backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
              >
                <CardHeader className="pb-2">
                  <CardDescription
                    className={`flex items-center justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <span>Monthly Salary</span>
                    {!editingSalary && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 rounded-full ${theme === "dark" ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"}`}
                        onClick={() => setEditingSalary(true)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </CardDescription>
                  {editingSalary ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={tempSalary}
                        onChange={(e) => setTempSalary(e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white h-9"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-green-600 hover:bg-green-700"
                        onClick={handleSaveSalary}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                        onClick={() => {
                          setTempSalary(monthlySalary.toString())
                          setEditingSalary(false)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <CardTitle className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {formatCurrency(monthlySalary)}
                    </CardTitle>
                  )}
                </CardHeader>
                <div className="h-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80"></div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
              <Card
                className={`overflow-hidden backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
              >
                <CardHeader className="pb-2">
                  <CardDescription
                    className={`flex items-center justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total Expenses
                  </CardDescription>
                  <CardTitle className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {formatCurrency(totalExpenses)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-xs text-gray-400 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
                    <span className="text-green-400 font-medium">12%</span> from last month
                  </div>
                </CardContent>
                <div className="h-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80"></div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
              <Card
                className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
              >
                <CardHeader className="pb-2">
                  <CardDescription
                    className={`flex items-center justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Balance
                  </CardDescription>
                  <CardTitle className={`text-3xl font-bold ${isProfitable ? "text-green-400" : "text-red-400"}`}>
                    {formatCurrency(profitLoss)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-xs text-gray-400 flex items-center">
                    {isProfitable ? (
                      <>
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
                        <span className="text-green-400 font-medium">Profit</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-3 w-3 mr-1 text-red-400" />
                        <span className="text-red-400 font-medium">Loss</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <div
                  className={`h-2 bg-gradient-to-r ${isProfitable ? "from-green-500/80 to-emerald-500/80" : "from-red-500/80 to-pink-500/80"}`}
                ></div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
              <Card
                className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
              >
                <CardHeader className="pb-2">
                  <CardDescription
                    className={`flex items-center justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Top Category
                  </CardDescription>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className={`w-3 h-3 rounded-full ${expensesByCategory[0]?.color || "bg-gray-500/80"}`}></div>
                    {expensesByCategory[0]?.name || "None"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(expensesByCategory[0]?.total || 0)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {Math.round((expensesByCategory[0]?.total / totalExpenses) * 100) || 0}% of total expenses
                  </div>
                </CardContent>
                <div className="h-2 bg-gradient-to-r from-yellow-500/80 to-orange-500/80"></div>
              </Card>
            </motion.div>
          </div>

          {/* Category Distribution */}
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
            <Card
              className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
            >
              <CardHeader>
                <CardTitle className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Expense Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {expensesByCategory
                    .filter((category) => category.total > 0)
                    .map((category) => (
                      <motion.div key={category.name} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                        <div
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            theme === "dark" ? "bg-gray-700/30 hover:bg-gray-700/50" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white shadow-lg`}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {category.name}
                            </div>
                            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                              {formatCurrency(category.total)}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <div className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {Math.round((category.total / totalExpenses) * 100)}%
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"} shadow-xl`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Expense Analytics
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={selectedChartType}
                      onValueChange={(value) => setSelectedChartType(value as ChartType)}
                    >
                      <SelectTrigger
                        className={`w-[150px] h-9 ${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
                      >
                        <SelectValue placeholder="Chart Type" />
                      </SelectTrigger>
                      <SelectContent
                        className={`${theme === "dark" ? "bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
                      >
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="radar">Radar Chart</SelectItem>
                        <SelectItem value="area">Area Graph</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="scatter">Scatter Plot</SelectItem>
                        <SelectItem value="stream">Stream Graph</SelectItem>
                      </SelectContent>
                    </Select>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`h-9 ${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
                        >
                          Categories
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className={`${theme === "dark" ? "bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
                      >
                        {categories.map((category) => (
                          <DropdownMenuCheckboxItem
                            key={category.name}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => handleCategorySelection(category.name)}
                          >
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                              {category.name}
                            </div>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className={`p-0 overflow-hidden ${theme === "dark" ? "bg-[#121212]" : "bg-gray-50"} rounded-b-lg`}
              >
                <div className="p-4">{renderChart()}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expense List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Recent Expenses
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[130px] h-9 bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white">
                        <SelectItem value="All">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
                  <TabsList
                    className={`grid grid-cols-4 w-full sm:w-[400px] ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/80"}`}
                  >
                    <TabsTrigger
                      value="all"
                      className={
                        theme === "dark" ? "data-[state=active]:bg-gray-600" : "data-[state=active]:bg-gray-300"
                      }
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="today"
                      className={
                        theme === "dark" ? "data-[state=active]:bg-gray-600" : "data-[state=active]:bg-gray-300"
                      }
                    >
                      Today
                    </TabsTrigger>
                    <TabsTrigger
                      value="week"
                      className={
                        theme === "dark" ? "data-[state=active]:bg-gray-600" : "data-[state=active]:bg-gray-300"
                      }
                    >
                      This Week
                    </TabsTrigger>
                    <TabsTrigger
                      value="month"
                      className={
                        theme === "dark" ? "data-[state=active]:bg-gray-600" : "data-[state=active]:bg-gray-300"
                      }
                    >
                      This Month
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-700">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <motion.div
                        key={expense.id}
                        whileHover={{
                          backgroundColor: theme === "dark" ? "rgba(75, 85, 99, 0.3)" : "rgba(243, 244, 246, 0.7)",
                        }}
                        className="p-4 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${getCategoryColor(expense.category)} flex items-center justify-center text-white shadow-lg`}
                          >
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div>
                            <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {expense.description}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs rounded-full ${
                                  theme === "dark"
                                    ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                {expense.category}
                              </Badge>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(expense.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {formatCurrency(expense.amount)}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-full h-8 w-8 ${
                                  theme === "dark"
                                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                                }`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white"
                            >
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400 focus:text-red-400"
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-400">
                      <PieChart className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                      <p>No expenses found.</p>
                      <p className="text-sm">Add a new expense or adjust your filters.</p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-gray-700/50 text-white border-gray-600 hover:bg-gray-700"
                        onClick={() => setIsAddExpenseOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              {filteredExpenses.length > 0 && (
                <CardFooter className="flex justify-between py-4 border-t border-gray-700">
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Showing {filteredExpenses.length} of {expenses.length} expenses
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        theme === "dark"
                          ? "bg-red-900/20 text-red-300 border-red-800 hover:bg-red-900/40 hover:text-red-200"
                          : "bg-red-100 text-red-600 border-red-300 hover:bg-red-200 hover:text-red-700"
                      }`}
                      onClick={handleClearExpenses}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        theme === "dark"
                          ? "bg-gray-700/50 text-white border-gray-600 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      View All
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

