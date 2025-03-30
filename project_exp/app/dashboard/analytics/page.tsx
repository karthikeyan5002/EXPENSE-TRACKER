import type { Metadata } from "next"
import AnalyticsPage from "@/components/analytics-page"
import DashboardLayout from "@/components/dashboard-layout"

export const metadata: Metadata = {
  title: "Analytics | ExpenseTracker",
  description: "Visualize your expense data",
}

export default function Analytics() {
  return (
    <DashboardLayout>
      <AnalyticsPage />
    </DashboardLayout>
  )
}

