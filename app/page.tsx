"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Gift, QrCode, ArrowRight, Soup, Utensils, Egg, Flame } from "lucide-react"
import Link from "next/link"

// Mock user data - in a real app, this would come from a database
const mockUser = {
  name: "ゲスト",
  points: 350,
  level: "ブロンズ",
  nextLevel: "シルバー",
  nextLevelPoints: 500,
  history: [
    { id: 1, date: "2023-06-15", action: "ポイント獲得", points: 25, store: "渋谷店" },
    { id: 2, date: "2023-06-10", action: "ポイント獲得", points: 30, store: "新宿店" },
    { id: 3, date: "2023-06-05", action: "特典交換", points: -100, reward: "味玉サービス" },
  ]
}

// Available rewards
const availableRewards = [
  { id: 1, name: "味玉サービス", points: 100, icon: Egg },
  { id: 2, name: "チャーシュー増量", points: 200, icon: Utensils },
  { id: 3, name: "ラーメン一杯無料", points: 500, icon: Soup },
]

export default function HomePage() {
  const [user] = useState(mockUser)
  
  // Calculate progress to next level
  const progressPercentage = Math.min(100, (user.points / user.nextLevelPoints) * 100)
  
  // Filter rewards that the user can redeem
  const redeemableRewards = availableRewards.filter(reward => user.points >= reward.points)

  return (
    <div className="flex flex-col px-4 py-6 max-w-md mx-auto space-y-6">
      {/* User Points Card */}
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">ようこそ、{user.name}さん</CardTitle>
          <CardDescription>{user.level}会員</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div className="text-3xl font-bold">{user.points} <span className="text-sm text-muted-foreground">ポイント</span></div>
            <div className="text-sm text-muted-foreground">{user.nextLevelPoints - user.points}ポイントで{user.nextLevel}へ</div>
          </div>
          
          <div className="space-y-1">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{user.level}</span>
              <span>{user.nextLevel}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link href="/collect-points" className="w-full">
            <Button className="w-full gap-2">
              <QrCode className="h-4 w-4" />
              ポイントを獲得する
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/rewards">
          <Card className="h-full hover:bg-accent/5 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Gift className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">特典を見る</p>
              <p className="text-xs text-muted-foreground">利用可能な特典: {redeemableRewards.length}</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/profile">
          <Card className="h-full hover:bg-accent/5 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <QrCode className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">履歴を見る</p>
              <p className="text-xs text-muted-foreground">最近の活動: {user.history.length}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Available Rewards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">利用可能な特典</h2>
          <Link href="/rewards" className="text-sm text-primary flex items-center">
            すべて見る <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {redeemableRewards.length > 0 ? (
            redeemableRewards.slice(0, 3).map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div className="p-4 flex items-center justify-center">
                      <reward.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 p-4">
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-sm text-muted-foreground">{reward.points} ポイント</p>
                    </div>
                    <div className="pr-4">
                      <Button variant="outline" size="sm">交換</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">まだ交換できる特典がありません</p>
                <p className="text-sm">もっとポイントを集めましょう！</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">最近の活動</h2>
          <Link href="/profile" className="text-sm text-primary flex items-center">
            すべて見る <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {user.history.slice(0, 3).map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.store ? item.store : item.reward}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className={`font-medium ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

