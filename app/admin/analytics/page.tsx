"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowLeft, TrendingUp, Users, Gift, Calendar, Download, ChevronDown } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api/mutator/custom-instance"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        // 実際のAPIが実装されるまでは、モックデータを使用
        // const response = await api.get(`/analytics?timeRange=${timeRange}`)
        // setAnalyticsData(response.data)
        
        // モックデータを使用
        setTimeout(() => {
          setAnalyticsData({
            summary: {
              totalSales: 4400000,
              totalCustomers: 710,
              totalRedemptions: 420,
              salesGrowth: 8.2,
              customerGrowth: 12.5,
              redemptionGrowth: 15.3
            },
            monthlySales: [
              { month: "1月", sales: 580000, customers: 450, avgOrder: 1289 },
              { month: "2月", sales: 620000, customers: 480, avgOrder: 1292 },
              { month: "3月", sales: 750000, customers: 520, avgOrder: 1442 },
              { month: "4月", sales: 820000, customers: 580, avgOrder: 1414 },
              { month: "5月", sales: 780000, customers: 550, avgOrder: 1418 },
              { month: "6月", sales: 850000, customers: 600, avgOrder: 1417 },
            ],
            rewardsRedemption: [
              { name: "味玉サービス", value: 120, color: "#8884d8" },
              { name: "チャーシュー増量", value: 85, color: "#83a6ed" },
              { name: "麺大盛り", value: 65, color: "#8dd1e1" },
              { name: "辛さアップ", value: 45, color: "#82ca9d" },
              { name: "ラーメン一杯無料", value: 30, color: "#a4de6c" },
              { name: "餃子一皿無料", value: 50, color: "#d0ed57" },
              { name: "小鉢一品サービス", value: 40, color: "#ffc658" },
            ],
            customerGrowth: [
              { month: "1月", newCustomers: 45, totalCustomers: 450 },
              { month: "2月", newCustomers: 38, totalCustomers: 488 },
              { month: "3月", newCustomers: 52, totalCustomers: 540 },
              { month: "4月", newCustomers: 65, totalCustomers: 605 },
              { month: "5月", newCustomers: 48, totalCustomers: 653 },
              { month: "6月", newCustomers: 57, totalCustomers: 710 },
            ],
            topMenuItems: [
              { name: "豚骨ラーメン", orders: 320, revenue: 416000 },
              { name: "醤油ラーメン", orders: 280, revenue: 336000 },
              { name: "味噌ラーメン", orders: 210, revenue: 273000 },
              { name: "辛味噌ラーメン", orders: 180, revenue: 252000 },
              { name: "塩ラーメン", orders: 150, revenue: 180000 },
            ],
            pointsData: [
              { month: "1月", earned: 4500, spent: 2800 },
              { month: "2月", earned: 4800, spent: 3100 },
              { month: "3月", earned: 5200, spent: 3500 },
              { month: "4月", earned: 5800, spent: 4200 },
              { month: "5月", earned: 5500, spent: 3800 },
              { month: "6月", earned: 6000, spent: 4500 },
            ]
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center">
        <Link href="/admin" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">売上分析</h1>
      </div>

      {/* Time Range and Export */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="期間を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">過去30日</SelectItem>
              <SelectItem value="3months">過去3ヶ月</SelectItem>
              <SelectItem value="6months">過去6ヶ月</SelectItem>
              <SelectItem value="1year">過去1年</SelectItem>
            </SelectContent>
          </Select>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          レポート出力
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              総売上
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{analyticsData.summary.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`inline-block mr-1 ${analyticsData.summary.salesGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                {analyticsData.summary.salesGrowth >= 0 ? "+" : ""}{analyticsData.summary.salesGrowth}%
              </span>
              前期比
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              顧客数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.summary.totalCustomers}人
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`inline-block mr-1 ${analyticsData.summary.customerGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                {analyticsData.summary.customerGrowth >= 0 ? "+" : ""}{analyticsData.summary.customerGrowth}%
              </span>
              前期比
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              特典交換数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.summary.totalRedemptions}回
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`inline-block mr-1 ${analyticsData.summary.redemptionGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                {analyticsData.summary.redemptionGrowth >= 0 ? "+" : ""}{analyticsData.summary.redemptionGrowth}%
              </span>
              前期比
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              平均客単価
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{Math.round(analyticsData.summary.totalSales / analyticsData.summary.totalCustomers).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              過去6ヶ月の平均
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different analytics */}
      <Tabs defaultValue="sales">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="sales">売上</TabsTrigger>
          <TabsTrigger value="customers">顧客</TabsTrigger>
          <TabsTrigger value="rewards">特典</TabsTrigger>
          <TabsTrigger value="menu">メニュー</TabsTrigger>
        </TabsList>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>月次売上推移</CardTitle>
              <CardDescription>過去6ヶ月の売上推移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData.monthlySales}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, "売上"]} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="売上" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>平均客単価推移</CardTitle>
              <CardDescription>過去6ヶ月の平均客単価推移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData.monthlySales}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, "客単価"]} />
                    <Legend />
                    <Line type="monotone" dataKey="avgOrder" name="客単価" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>顧客数推移</CardTitle>
              <CardDescription>過去6ヶ月の顧客数推移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData.customerGrowth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalCustomers" name="総顧客数" stroke="#8884d8" />
                    <Line type="monotone" dataKey="newCustomers" name="新規顧客" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>ポイント推移</CardTitle>
              <CardDescription>過去6ヶ月のポイント付与・使用推移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.pointsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="earned" name="付与ポイント" fill="#82ca9d" />
                    <Bar dataKey="spent" name="消費ポイント" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>特典交換分布</CardTitle>
              <CardDescription>特典別の交換回数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.rewardsRedemption}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.rewardsRedemption.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>人気メニュー</CardTitle>
              <CardDescription>注文数上位のメニュー</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.topMenuItems}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="注文数" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>売上貢献度</CardTitle>
              <CardDescription>メニュー別の売上貢献度</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.topMenuItems}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.topMenuItems.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={[
                          "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"
                        ][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 