"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, LogIn, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { login, signup, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(loginData.email, loginData.password)
    if (!success) {
      setError("Invalid email or password")
    } else {
      router.push("/dashboard")
    }
  }

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!signupData.name || !signupData.email || !signupData.password) {
      setError("Please fill in all fields")
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const success = await signup(signupData.email, signupData.name, signupData.password)
    if (!success) {
      setError("Email already in use")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-xl shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white text-center">ExpenseTracker</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Manage your expenses and track your financial health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6 bg-gray-700/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-gray-600">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gray-600">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <LogIn className="h-4 w-4 mr-2" />
                      )}
                      Login
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-300">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      Sign Up
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">
              {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
              <Button
                variant="link"
                className="p-0 text-blue-400 hover:text-blue-300"
                onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
              >
                {activeTab === "login" ? "Sign up" : "Login"}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

