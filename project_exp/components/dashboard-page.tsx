"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useExpense } from "@/lib/expense-context"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const { expenses, categories, totalExpenses } = useExpense()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate profit/loss
  const profitLoss = user?.monthlySalary ? user.monthlySalary - totalExpenses : 0
  const isProfitable = profitLoss >= 0

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

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

  // Get recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/dashboard/expenses">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription>Monthly Salary</CardDescription>
              <CardTitle className="text-3xl font-bold">{formatCurrency(user?.monthlySalary || 0)}</CardTitle>
            </CardHeader>
            <div className="h-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80"></div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-3xl font-bold">{formatCurrency(totalExpenses)}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
                <span className="text-green-400 font-medium">This Month</span>
              </div>
            </CardContent>
            <div className="h-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80"></div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="card-hover-effect">
          <Card className="shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription>Balance</CardDescription>
              <CardTitle className={`text-3xl font-bold ${isProfitable ? "text-green-400" : "text-red-400"}`}>
                {formatCurrency(profitLoss)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-xs text-muted-foreground flex items-center">
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
          <Card className="shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription>Top Category</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${expensesByCategory[0]?.color || "bg-gray-500/80"}`}></div>
                {expensesByCategory[0]?.name || "None"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold">{formatCurrency(expensesByCategory[0]?.total || 0)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalExpenses > 0
                  ? `${Math.round((expensesByCategory[0]?.total / totalExpenses) * 100) || 0}% of total expenses`
                  : "No expenses yet"}
              </div>
            </CardContent>
            <div className="h-2 bg-gradient-to-r from-yellow-500/80 to-orange-500/80"></div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Expenses and Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-xl h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Expenses</CardTitle>
              <Link href="/dashboard/expenses">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentExpenses.length > 0 ? (
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="p-3 rounded-lg flex items-center justify-between bg-accent/50">
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
                          <div className="text-sm text-muted-foreground">
                            {formatDate(expense.date)} • {expense.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-medium">{formatCurrency(expense.amount)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No expenses recorded yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Add your first expense to see it here.</p>
                  <Link href="/dashboard/expenses" className="mt-4 inline-block">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Category Distribution</CardTitle>
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm">
                  View Analytics
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {expensesByCategory.some((category) => category.total > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {expensesByCategory
                    .filter((category) => category.total > 0)
                    .map((category) => (
                      <div
                        key={category.name}
                        className="p-3 rounded-lg flex items-center justify-between bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-xl`}
                          >
                            {category.icon}
                          </div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                        <div>
                          <div className="text-lg font-medium text-right">{formatCurrency(category.total)}</div>
                          <div className="text-sm text-right text-muted-foreground">
                            {Math.round((category.total / totalExpenses) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No category data available.</p>
                  <p className="text-sm text-muted-foreground mt-1">Add expenses to see category distribution.</p>
                  <Link href="/dashboard/expenses" className="mt-4 inline-block">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

