"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { QrCode, Users, Gift, BarChart3, Soup } from "lucide-react"
import Link from "next/link"

const initialRewards = [
  { id: 1, name: "味玉サービス", points: 100 },
  { id: 2, name: "チャーシュー増量", points: 200 },
  { id: 3, name: "ラーメン一杯無料", points: 500 },
]

const analyticsData = [
  { name: "1月", redemptions: 65 },
  { name: "2月", redemptions: 59 },
  { name: "3月", redemptions: 80 },
  { name: "4月", redemptions: 81 },
  { name: "5月", redemptions: 56 },
  { name: "6月", redemptions: 55 },
]

export default function AdminDashboard() {
  const [rewards, setRewards] = useState(initialRewards)
  const [newReward, setNewReward] = useState({ name: "", points: "" })

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReward.name && newReward.points) {
      setRewards([...rewards, { ...newReward, id: Date.now(), points: Number.parseInt(newReward.points) }])
      setNewReward({ name: "", points: "" })
    }
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
        
        <Card className="h-full hover:bg-accent/5 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              売上分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              ポイント利用状況や売上の詳細分析を表示します
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Soup className="h-5 w-5 text-primary" />
            特典管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddReward} className="space-y-4 mb-4">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
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
                <Button type="submit">追加</Button>
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
                        onClick={() => setRewards(rewards.filter((r) => r.id !== reward.id))}
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

