"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search, Trash2, Filter } from "lucide-react"
import { useExpense } from "@/lib/expense-context"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, categories } = useExpense()
  const router = useRouter()
  const [mounted, setMounted] = useState(true)

  // New expense state
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  })

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("all")

  // Form validation
  const [errors, setErrors] = useState({
    amount: "",
    description: "",
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = {
      amount: !newExpense.amount ? "Amount is required" : "",
      description: !newExpense.description ? "Description is required" : "",
    }

    setErrors(validationErrors)

    // Check if there are any errors
    if (validationErrors.amount || validationErrors.description) {
      return
    }

    // Add expense
    addExpense({
      amount: Number(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      date: newExpense.date,
    })

    // Show success toast
    toast({
      title: "Expense added",
      description: `₹${newExpense.amount} for ${newExpense.description} has been added.`,
    })

    // Reset form
    setNewExpense({
      amount: "",
      description: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
    })
  }

  // Handle expense deletion
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id)
    toast({
      title: "Expense deleted",
      description: "The expense has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl">Add New Expense</CardTitle>
                <CardDescription>Fill in the details to add a new expense</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                  {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What did you spend on?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-9"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Expense List</CardTitle>
              <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length > 0 ? (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="p-4 rounded-lg flex items-center justify-between bg-accent/50 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            categories.find((c) => c.name === expense.category)?.color || "bg-gray-500/80"
                          } flex items-center justify-center text-xl`}
                        >
                          {categories.find((c) => c.name === expense.category)?.icon || "📦"}
                        </div>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline" className="text-xs rounded-full">
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
                        <div className="text-lg font-medium">{formatCurrency(expense.amount)}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Filter className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No expenses found.</p>
                  <p className="text-sm text-muted-foreground mt-1">Add a new expense or adjust your filters.</p>
                </div>
              )}
            </CardContent>
            {filteredExpenses.length > 0 && (
              <CardFooter className="flex justify-between py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
}

