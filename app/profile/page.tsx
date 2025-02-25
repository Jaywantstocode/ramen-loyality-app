"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Soup, Utensils, Egg, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

// Mock user data - in a real app, this would come from a database
const mockUser = {
  name: "ゲスト",
  email: "guest@example.com",
  points: 350,
  level: "ブロンズ",
  nextLevel: "シルバー",
  nextLevelPoints: 500,
  joinDate: "2023年4月15日",
  favoriteRamen: "醤油ラーメン",
  visits: 15,
  history: [
    { id: 1, date: "2023-06-15", action: "ポイント獲得", points: 25, store: "渋谷店" },
    { id: 2, date: "2023-06-10", action: "ポイント獲得", points: 30, store: "新宿店" },
    { id: 3, date: "2023-06-05", action: "特典交換", points: -100, reward: "味玉サービス" },
    { id: 4, date: "2023-05-28", action: "ポイント獲得", points: 40, store: "池袋店" },
    { id: 5, date: "2023-05-20", action: "特典交換", points: -200, reward: "チャーシュー増量" },
    { id: 6, date: "2023-05-15", action: "ポイント獲得", points: 35, store: "渋谷店" },
    { id: 7, date: "2023-05-05", action: "ポイント獲得", points: 30, store: "新宿店" },
  ],
  redeemed: [
    { id: 1, date: "2023-06-05", name: "味玉サービス", points: 100, icon: Egg },
    { id: 2, date: "2023-05-20", name: "チャーシュー増量", points: 200, icon: Utensils },
    { id: 3, date: "2023-04-10", name: "ラーメン一杯無料", points: 500, icon: Soup },
  ]
}

export default function ProfilePage() {
  const [user] = useState(mockUser)

  return (
    <div className="flex flex-col px-4 py-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">プロフィール</h1>
      
      {/* User Profile Card */}
      <Card className="w-full shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge variant="outline" className="mt-1">{user.level}会員</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">保有ポイント</span>
              <span className="font-bold text-lg">{user.points}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">来店回数</span>
              <span className="font-bold text-lg">{user.visits}回</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">会員登録日</span>
              <span className="font-medium">{user.joinDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">お気に入り</span>
              <span className="font-medium">{user.favoriteRamen}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Activity Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="history">履歴</TabsTrigger>
          <TabsTrigger value="redeemed">交換済み特典</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          {user.history.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {item.store ? (
                        <>
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{item.store}</p>
                        </>
                      ) : (
                        <>
                          <Soup className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{item.reward}</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="redeemed" className="space-y-4 mt-4">
          {user.redeemed.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-4 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 p-4">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="pr-4">
                    <Badge variant="outline">{item.points} ポイント</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      {/* Settings Button */}
      <Button variant="outline" className="w-full">
        設定を変更
      </Button>
    </div>
  )
} 