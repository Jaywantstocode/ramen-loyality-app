"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { ArrowLeft, Camera, Check, QrCode, X } from "lucide-react"
import Link from "next/link"

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  { id: "user1", name: "田中 太郎", points: 450, email: "tanaka@example.com", visits: 12 },
  { id: "user2", name: "佐藤 花子", points: 230, email: "sato@example.com", visits: 8 },
  { id: "user3", name: "鈴木 一郎", points: 780, email: "suzuki@example.com", visits: 25 },
]

export default function ScanQRPage() {
  const [scanning, setScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState("")
  const [manualCode, setManualCode] = useState("")
  const [pointsToAdd, setPointsToAdd] = useState(10)
  const [user, setUser] = useState<typeof mockUsers[0] | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera for QR code scanning
  const startScanning = async () => {
    try {
      const constraints = {
        video: { facingMode: "environment" }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setScanning(true)
        
        // In a real app, you would use a library like jsQR to scan the video feed
        // For this demo, we'll simulate a scan after 3 seconds
        setTimeout(() => {
          const mockQRCode = `RAMEN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
          handleScan(mockQRCode)
        }, 3000)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast.error("カメラへのアクセスに失敗しました")
    }
  }

  // Stop camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  // Handle scanned QR code
  const handleScan = (code: string) => {
    setScannedCode(code)
    stopScanning()
    
    // In a real app, you would validate the code against your database
    // For this demo, we'll just pick a random user
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    setUser(randomUser)
  }

  // Handle manual code entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode) return
    
    handleScan(manualCode)
  }

  // Award points to user
  const awardPoints = () => {
    if (!user) return
    
    // In a real app, you would update the database
    toast.success(`${user.name}に${pointsToAdd}ポイントを付与しました！`, {
      description: `現在の合計: ${user.points + pointsToAdd}ポイント`,
      duration: 5000,
    })
    
    // Reset state
    setScannedCode("")
    setManualCode("")
    setUser(null)
    setPointsToAdd(10)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-md mx-auto">
      <div className="w-full flex items-center mb-6">
        <Link href="/admin" className="mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">QRコードスキャン</h1>
      </div>
      
      <Card className="w-full shadow-lg">
        {!scannedCode ? (
          <>
            <CardHeader>
              <CardTitle>ポイント付与</CardTitle>
              <CardDescription>
                お客様のQRコードをスキャンするか、コードを手動で入力してください
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {scanning ? (
                <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[3px] border-white/30 rounded-lg">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 border-2 border-primary rounded-lg"></div>
                  </div>
                  <Button 
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-4 right-4 rounded-full"
                    onClick={stopScanning}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={startScanning} 
                  className="w-full py-8 flex flex-col gap-2"
                >
                  <Camera className="h-8 w-8 mb-1" />
                  <span>カメラでスキャン</span>
                </Button>
              )}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    または
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qrCode">QRコードを手動入力</Label>
                  <div className="flex gap-2">
                    <Input
                      id="qrCode"
                      placeholder="RAMEN-123456789"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                    />
                    <Button type="submit" disabled={!manualCode}>
                      <QrCode className="h-4 w-4 mr-2" />
                      確認
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>ポイント付与</CardTitle>
              <CardDescription>
                {user ? `${user.name}さんにポイントを付与します` : 'ユーザー情報を取得中...'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {user && (
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">名前</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">現在のポイント</p>
                        <p className="font-medium">{user.points}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">来店回数</p>
                        <p className="font-medium">{user.visits}回</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">メール</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>付与するポイント: {pointsToAdd}</Label>
                      <Slider
                        value={[pointsToAdd]}
                        min={1}
                        max={100}
                        step={1}
                        onValueChange={(value) => setPointsToAdd(value[0])}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setScannedCode("")
                          setUser(null)
                        }}
                      >
                        キャンセル
                      </Button>
                      <Button 
                        className="flex-1 gap-2"
                        onClick={awardPoints}
                      >
                        <Check className="h-4 w-4" />
                        ポイント付与
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
} 