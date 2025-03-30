"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type React from "react"

// Define expense type
export type Expense = {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

// Define category type with color
export type Category = {
  name: string
  color: string
  icon: string
}

// Define expense context type
type ExpenseContextType = {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  clearAllExpenses: () => void
  categories: Category[]
  totalExpenses: number
}

// Create context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  // Save expenses to localStorage when they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  // Add a new expense
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  // Clear all expenses
  const clearAllExpenses = () => {
    setExpenses([])
  }

  // Categories with icons
  const categories: Category[] = [
    { name: "Food", color: "bg-blue-500/80", icon: "🍔" },
    { name: "Transport", color: "bg-green-500/80", icon: "🚗" },
    { name: "Shopping", color: "bg-pink-500/80", icon: "🛍️" },
    { name: "Bills", color: "bg-yellow-500/80", icon: "📄" },
    { name: "Entertainment", color: "bg-orange-500/80", icon: "🎬" },
    { name: "Other", color: "bg-purple-500/80", icon: "📦" },
  ]

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        clearAllExpenses,
        categories,
        totalExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpense = () => {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}

