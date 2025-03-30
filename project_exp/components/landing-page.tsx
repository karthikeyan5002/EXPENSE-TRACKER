"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Wallet } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-wallet h-12 w-12 text-blue-400"
            >
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold text-white">ExpenseTracker</h1>
          </div>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Take control of your finances with our powerful expense tracking solution. Monitor spending, analyze trends,
            and achieve your financial goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => router.push("/signup")}
            >
              Create Account
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">Why Choose ExpenseTracker?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
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
                  className="text-blue-400"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Track Expenses</h3>
              <p className="text-gray-400">
                Easily log and categorize your daily expenses to keep a close eye on your spending habits.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
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
                  className="text-purple-400"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Visualize Data</h3>
              <p className="text-gray-400">
                Powerful charts and analytics help you understand your spending patterns at a glance.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
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
                  className="text-green-400"
                >
                  <path d="M2 20h.01" />
                  <path d="M7 20v-4" />
                  <path d="M12 20v-8" />
                  <path d="M17 20V8" />
                  <path d="M22 4v16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Financial Insights</h3>
              <p className="text-gray-400">
                Get personalized insights and recommendations to improve your financial health.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

