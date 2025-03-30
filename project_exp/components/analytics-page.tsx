"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useExpense } from "@/lib/expense-context"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define chart type
type ChartType = "radar" | "bar" | "pie" | "area" | "scatter" | "line" | "stream"

export default function AnalyticsPage() {
  const { expenses, categories } = useExpense()
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("bar")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories.map((c) => c.name))
  const [timeRange, setTimeRange] = useState("all")
  const [mounted, setMounted] = useState(true)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter expenses by time range
  const filterExpensesByTimeRange = (expenses: typeof expenses) => {
    if (timeRange === "all") return expenses

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      if (timeRange === "today") return expenseDate >= today
      if (timeRange === "week") return expenseDate >= lastWeek
      if (timeRange === "month") return expenseDate >= lastMonth
      return true
    })
  }

  // Filter expenses by selected categories
  const filteredBySelectedCategories = filterExpensesByTimeRange(expenses).filter((expense) =>
    selectedCategories.includes(expense.category),
  )

  // Prepare data for charts
  const prepareChartData = () => {
    // For category-based charts (bar, pie, radar)
    const categoryData = categories
      .filter((category) => selectedCategories.includes(category.name))
      .map((category) => {
        const total = filteredBySelectedCategories
          .filter((expense) => expense.category === category.name)
          .reduce((sum, expense) => sum + expense.amount, 0)

        return {
          name: category.name,
          value: total,
          color: category.color.replace("bg-", "").replace("/80", ""),
        }
      })
      .filter((item) => item.value > 0)

    // For time-based charts (area, line, stream)
    const dateMap = new Map<string, Record<string, number>>()

    filteredBySelectedCategories.forEach((expense) => {
      const date = formatDate(expense.date)
      if (!dateMap.has(date)) {
        dateMap.set(date, {})
      }

      const dateData = dateMap.get(date)!
      if (dateData[expense.category]) {
        dateData[expense.category] += expense.amount
      } else {
        dateData[expense.category] = expense.amount
      }
    })

    const timeData = Array.from(dateMap.entries())
      .map(([date, categories]) => ({
        date,
        ...categories,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // For scatter plot
    const scatterData = filteredBySelectedCategories.map((expense) => ({
      x: new Date(expense.date).getTime(),
      y: expense.amount,
      category: expense.category,
      description: expense.description,
    }))

    return {
      categoryData,
      timeData,
      scatterData,
    }
  }

  const { categoryData, timeData, scatterData } = prepareChartData()

  // Handle category selection
  const handleCategorySelection = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Render chart based on selected type
  const renderChart = () => {
    const chartColor = "#2268D1" // Use the requested color
    const gridColor = "rgba(255, 255, 255, 0.1)"
    const textColor = "#aaa"
    const tooltipStyle = {
      backgroundColor: "#1e1e1e",
      border: "1px solid #333",
      borderRadius: "4px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
      color: "#fff",
    }

    switch (selectedChartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [formatCurrency(value as number), "Amount"]}
                cursor={{ fill: "rgba(34, 104, 209, 0.1)" }}
              />
              <Bar dataKey="value" name="Amount" fill={chartColor} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill={chartColor}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(210, 73%, ${40 + index * 5}%)`} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} contentStyle={tooltipStyle} />
            </RechartsPieChart>
          </ResponsiveContainer>
        )

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius={150} data={categoryData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="name" stroke={textColor} />
              <PolarRadiusAxis stroke={textColor} />
              <Radar name="Expenses" dataKey="value" stroke={chartColor} fill={chartColor} fillOpacity={0.6} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value as number), ""]} />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fill={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value as number), ""]} />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={`hsl(210, 73%, ${40 + index * 5}%)`}
                  strokeWidth={2}
                  dot={{ fill: `hsl(210, 73%, ${40 + index * 5}%)`, r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 1 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number"
                dataKey="x"
                name="Date"
                stroke={textColor}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(tick) => formatDate(new Date(tick).toISOString().split("T")[0])}
              />
              <YAxis type="number" dataKey="y" name="Amount" stroke={textColor} tickFormatter={(tick) => `₹${tick}`} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={tooltipStyle}
                formatter={(value, name, props) => {
                  if (name === "y") {
                    return [formatCurrency(value as number), "Amount"]
                  }
                  if (name === "x") {
                    return [formatDate(new Date(value as number).toISOString().split("T")[0]), "Date"]
                  }
                  return [value, name]
                }}
              />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Scatter
                  key={category}
                  name={category}
                  data={scatterData.filter((d) => d.category === category)}
                  fill={`hsl(210, 73%, ${40 + index * 5}%)`}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )

      case "stream":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value as number), ""]} />
              <Legend />
              {selectedCategories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fill={`hsl(210, 73%, ${40 + index * 5}%)`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Select a chart type to visualize your expenses
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expense Analytics</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-lg">Expense Visualization</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={selectedChartType} onValueChange={(value) => setSelectedChartType(value as ChartType)}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="radar">Radar Chart</SelectItem>
                    <SelectItem value="area">Area Graph</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="stream">Stream Graph</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9">
                      Categories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category.name}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => handleCategorySelection(category.name)}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                          {category.name}
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden bg-card rounded-b-lg">
            <div className="p-4">
              {expenses.length > 0 ? (
                renderChart()
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  <div className="text-center">
                    <p>No expense data available.</p>
                    <p className="text-sm mt-2">Add expenses to see analytics.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(filteredBySelectedCategories.reduce((sum, expense) => sum + expense.amount, 0))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm text-muted-foreground mb-1">Average Expense</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredBySelectedCategories.length > 0
                      ? filteredBySelectedCategories.reduce((sum, expense) => sum + expense.amount, 0) /
                          filteredBySelectedCategories.length
                      : 0,
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm text-muted-foreground mb-1">Highest Expense</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredBySelectedCategories.length > 0
                      ? Math.max(...filteredBySelectedCategories.map((expense) => expense.amount))
                      : 0,
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

