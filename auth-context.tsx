"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define user type
export type User = {
  id: string
  email: string
  name: string
  profilePicture?: string
  monthlySalary: number
}

// Define auth context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, name: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample users for demo
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "user@example.com": {
    password: "password123",
    user: {
      id: "1",
      email: "user@example.com",
      name: "Demo User",
      profilePicture: "/placeholder.svg?height=200&width=200",
      monthlySalary: 50000,
    },
  },
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userRecord = DEMO_USERS[email.toLowerCase()]

    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Signup function
  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (DEMO_USERS[email.toLowerCase()]) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      monthlySalary: 0,
    }

    // In a real app, you would save this to a database
    DEMO_USERS[email.toLowerCase()] = {
      password,
      user: newUser,
    }

    setUser(newUser)
    setIsLoading(false)
    return true
  }

  // Logout function
  const logout = () => {
    setUser(null)
    window.location.href = "/"
  }

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)

      // Update in demo users
      if (DEMO_USERS[user.email]) {
        DEMO_USERS[user.email].user = updatedUser
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

