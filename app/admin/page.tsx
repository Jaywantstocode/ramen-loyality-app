"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { QrCode, Users, Gift, BarChart3, Soup } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api/mutator/custom-instance"
import { toast } from "sonner"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function AdminDashboard() {
  const [rewards, setRewards] = useState<any[]>([])
  const [newReward, setNewReward] = useState({ name: "", points: "" })
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any[]>([])

  // 特典データを取得
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true)
        // 実際のAPIが実装されるまでは、モックデータを使用
        // const response = await api.get('/rewards')
        // setRewards(response.data)
        
        // モックデータを使用
        setTimeout(() => {
          setRewards([
            { id: 1, name: "味玉サービス", points: 100 },
            { id: 2, name: "チャーシュー増量", points: 200 },
            { id: 3, name: "ラーメン一杯無料", points: 500 },
          ])
          
          setAnalyticsData([
            { name: "1月", redemptions: 65 },
            { name: "2月", redemptions: 59 },
            { name: "3月", redemptions: 80 },
            { name: "4月", redemptions: 81 },
            { name: "5月", redemptions: 56 },
            { name: "6月", redemptions: 55 },
          ])
          
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching rewards:", error)
        setLoading(false)
      }
    }
    
    fetchRewards()
  }, [])

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReward.name || !newReward.points) return
    
    try {
      setLoading(true)
      // 実際のAPIが実装されるまでは、クライアント側で処理
      // const response = await api.post('/rewards', newReward)
      // const addedReward = response.data
      
      // クライアント側で処理
      const addedReward = { 
        ...newReward, 
        id: Date.now(), 
        points: Number.parseInt(newReward.points) 
      }
      
      setRewards([...rewards, addedReward])
      setNewReward({ name: "", points: "" })
      toast.success("特典を追加しました")
    } catch (error) {
      console.error("Error adding reward:", error)
      toast.error("特典の追加に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReward = async (id: number) => {
    try {
      setLoading(true)
      // 実際のAPIが実装されるまでは、クライアント側で処理
      // await api.delete(`/rewards/${id}`)
      
      // クライアント側で処理
      setRewards(rewards.filter(reward => reward.id !== id))
      toast.success("特典を削除しました")
    } catch (error) {
      console.error("Error deleting reward:", error)
      toast.error("特典の削除に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  if (loading && rewards.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">管理ダッシュボード</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/scan">
          <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QRコードスキャン
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                お客様のQRコードをスキャンしてポイントを付与します
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/customers">
          <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                顧客管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                顧客情報の確認や編集を行います
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/analytics">
          <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                売上分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                売上や顧客データの分析を行います
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Rewards Management */}
      <Card>
        <CardHeader>
          <CardTitle>特典管理</CardTitle>
          <CardDescription>
            ポイント交換の特典を管理します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddReward}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="rewardName">特典名</Label>
                <Input
                  id="rewardName"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  placeholder="特典名を入力"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="rewardPoints">必要ポイント</Label>
                <Input
                  id="rewardPoints"
                  type="number"
                  value={newReward.points}
                  onChange={(e) => setNewReward({ ...newReward, points: e.target.value })}
                  placeholder="必要ポイントを入力"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading || !newReward.name || !newReward.points}>
                  {loading ? "追加中..." : "追加"}
                </Button>
              </div>
            </div>
          </form>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>特典名</TableHead>
                  <TableHead>必要ポイント</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>{reward.name}</TableCell>
                    <TableCell>{reward.points}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteReward(reward.id)}
                        disabled={loading}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>特典交換分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="redemptions" fill="#8884d8" name="交換数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

