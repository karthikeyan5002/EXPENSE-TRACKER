"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
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
            className="lucide lucide-wallet text-blue-400"
          >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
          </svg>
          <h1 className="text-4xl font-bold text-white">ExpenseTracker</h1>
        </motion.div>
        <motion.p
          className="text-xl text-gray-300 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Take control of your finances with our simple and powerful expense tracking solution.
        </motion.p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Button
          onClick={() => router.push("/login")}
          className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          variant="outline"
          className="px-8 py-6 text-lg border-blue-400 text-blue-400 hover:bg-blue-900/20 rounded-xl"
        >
          Sign Up
        </Button>
      </motion.div>

      <motion.div
        className="mt-16 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <p>© 2025 ExpenseTracker. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

