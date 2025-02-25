"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Soup, Utensils, Egg, Flame, Wheat, Beef, UtensilsCrossed, Salad } from "lucide-react"
import { toast } from "sonner"

// Mock user data
const mockUser = {
  points: 350,
}

// All rewards
const allRewards = [
  { id: 1, name: "味玉サービス", points: 100, description: "ラーメンに味玉1個追加", icon: Egg, category: "トッピング" },
  { id: 2, name: "チャーシュー増量", points: 200, description: "チャーシューを2枚追加", icon: Beef, category: "トッピング" },
  { id: 3, name: "麺大盛り", points: 150, description: "麺の量1.5倍", icon: Wheat, category: "麺・スープ" },
  { id: 4, name: "辛さアップ", points: 100, description: "お好みの辛さに調整", icon: Flame, category: "麺・スープ" },
  { id: 5, name: "ラーメン一杯無料", points: 500, description: "ラーメン1杯無料", icon: Soup, category: "メイン" },
  { id: 6, name: "餃子一皿無料", points: 300, description: "餃子1皿無料", icon: UtensilsCrossed, category: "サイド" },
  { id: 7, name: "小鉢一品サービス", points: 200, description: "小鉢メニューから1品", icon: Salad, category: "サイド" },
]

export default function RewardsPage() {
  const [user] = useState(mockUser)
  const [selectedReward, setSelectedReward] = useState<typeof allRewards[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Get unique categories
  const categories = ["すべて", ...new Set(allRewards.map(reward => reward.category))]
  
  // Handle reward redemption
  const redeemReward = () => {
    if (!selectedReward) return
    
    if (user.points >= selectedReward.points) {
      // In a real app, you would call an API to redeem the reward
      toast.success(`${selectedReward.name}を交換しました！`, {
        description: `${selectedReward.points}ポイントを使用しました`,
      })
    } else {
      toast.error("ポイントが足りません", {
        description: `あと${selectedReward.points - user.points}ポイント必要です`,
      })
    }
    
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col px-4 py-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">特典一覧</h1>
      
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">現在の保有ポイント</p>
        <p className="text-xl font-bold">{user.points} <span className="text-sm text-muted-foreground">ポイント</span></p>
      </div>
      
      <Tabs defaultValue="すべて" className="w-full">
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start mb-4 pb-1">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="whitespace-nowrap">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            {allRewards
              .filter(reward => category === "すべて" || reward.category === category)
              .map(reward => {
                const isRedeemable = user.points >= reward.points
                
                return (
                  <Card 
                    key={reward.id} 
                    className={`overflow-hidden transition-colors ${!isRedeemable ? 'opacity-70' : ''}`}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className={`p-4 flex items-center justify-center`}>
                          <reward.icon className={`h-6 w-6 ${isRedeemable ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{reward.name}</p>
                            <Badge variant="outline" className="text-xs">{reward.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                          <p className="text-sm font-medium mt-1">{reward.points} ポイント</p>
                        </div>
                        <div className="pr-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={!isRedeemable}
                            onClick={() => {
                              setSelectedReward(reward)
                              setDialogOpen(true)
                            }}
                          >
                            交換
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>特典と交換しますか？</DialogTitle>
            <DialogDescription>
              {selectedReward && (
                <>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      {selectedReward.icon && <selectedReward.icon className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{selectedReward.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="flex justify-between">
                      <span>必要ポイント:</span>
                      <span className="font-medium">{selectedReward.points} ポイント</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>交換後の残高:</span>
                      <span className="font-medium">{user.points - selectedReward.points} ポイント</span>
                    </div>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={redeemReward}>
              交換する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

