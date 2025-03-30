"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Check } from "lucide-react"
import { useExpense } from "./expense-context"
import { toast } from "@/components/ui/use-toast"

export default function AddExpensePage() {
  const { addExpense, categories } = useExpense()
  const router = useRouter()
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  // New expense state
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  })

  // Form validation
  const [errors, setErrors] = useState({
    amount: "",
    description: "",
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

    // Navigate to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Add New Expense
      </h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card
          className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
        >
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Expense Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  className={`${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="What did you spend on?"
                  className={`${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  Category
                </Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger
                    id="category"
                    className={`${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent
                    className={`${theme === "dark" ? "bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
                  >
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
                <Label htmlFor="date" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    className={`pl-9 ${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
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
                <Check className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

