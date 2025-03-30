import type { Metadata } from "next"
import ExpensesPage from "@/components/expenses-page"
import DashboardLayout from "@/components/dashboard-layout"

export const metadata: Metadata = {
  title: "Expenses | ExpenseTracker",
  description: "Manage your expenses",
}

export default function Expenses() {
  return (
    <DashboardLayout>
      <ExpensesPage />
    </DashboardLayout>
  )
}

