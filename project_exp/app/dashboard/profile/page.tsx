import type { Metadata } from "next"
import ProfilePage from "@/components/profile-page"
import DashboardLayout from "@/components/dashboard-layout"

export const metadata: Metadata = {
  title: "Profile | ExpenseTracker",
  description: "Manage your profile settings",
}

export default function Profile() {
  return (
    <DashboardLayout>
      <ProfilePage />
    </DashboardLayout>
  )
}

