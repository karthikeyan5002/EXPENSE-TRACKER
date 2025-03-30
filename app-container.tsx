"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import LoginPage from "./login-page"
import ExpenseTracker from "./expense-tracker"
import ProfilePage from "./profile-page"
import { AnimatePresence, motion } from "framer-motion"

export default function AppContainer() {
  const { user, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState<"login" | "expense-tracker" | "profile">("login")

  // Update current page based on auth state
  useEffect(() => {
    if (isLoading) return

    if (!user) {
      setCurrentPage("login")
    } else if (currentPage === "login") {
      setCurrentPage("expense-tracker")
    }
  }, [user, isLoading, currentPage])

  // Navigate to profile page
  const navigateToProfile = () => {
    setCurrentPage("profile")
  }

  // Navigate to expense tracker
  const navigateToExpenseTracker = () => {
    setCurrentPage("expense-tracker")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {currentPage === "login" && !user && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage />
        </motion.div>
      )}

      {currentPage === "expense-tracker" && user && (
        <motion.div
          key="expense-tracker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ExpenseTracker
            navigateToProfile={navigateToProfile}
            monthlySalary={user.monthlySalary}
            userName={user.name}
            userProfilePicture={user.profilePicture}
          />
        </motion.div>
      )}

      {currentPage === "profile" && user && (
        <motion.div
          key="profile"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProfilePage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

