"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Check, Loader2, X } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || "")
  const [monthlySalary, setMonthlySalary] = useState(user?.monthlySalary?.toString() || "0")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!user) return

    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateUser({
      name,
      monthlySalary: Number.parseFloat(monthlySalary) || 0,
    })

    setIsEditing(false)
    setIsSaving(false)
  }

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        updateUser({
          profilePicture: event.target.result as string,
        })
      }
    }

    reader.readAsDataURL(file)
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Your Profile</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card
          className={`backdrop-blur-xl ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} shadow-xl`}
        >
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-gray-700 bg-gray-700">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="text-xl bg-gray-700 text-white">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <CardTitle className={`mt-4 text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {user.name}
              </CardTitle>
              <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary" className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                      Monthly Salary (₹)
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(e.target.value)}
                      className={`${theme === "dark" ? "bg-gray-700/50 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Monthly Salary</span>
                    <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      ₹{user.monthlySalary.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-2 pt-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className={`${theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => {
                    setName(user.name)
                    setMonthlySalary(user.monthlySalary.toString())
                    setIsEditing(false)
                  }}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

