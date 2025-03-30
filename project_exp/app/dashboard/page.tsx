import type { Metadata } from "next"
import DashboardPage from "@/components/dashboard-page"
import DashboardLayout from "@/components/dashboard-layout"

export const metadata: Metadata = {
  title: "Dashboard | ExpenseTracker",
  description: "View your expense summary and financial overview",
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  )
}

