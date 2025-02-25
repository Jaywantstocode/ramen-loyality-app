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
import LoadingSpinner from "@/components/LoadingSpinner"
import jsQR from "jsqr"
import { usePointsControllerAwardPoints } from "@/lib/api/generated/points/points"
import { CreatePointTransactionDtoType } from "@/lib/api/generated/types"

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
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  // 生成されたAPIフックを使用
  const { trigger: awardPointsToUser, isMutating } = usePointsControllerAwardPoints()

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
        videoRef.current.play()
        setScanning(true)
        scanQRCode()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast.error("カメラへのアクセスに失敗しました")
    }
  }

  // Scan QR code from video feed
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    
    const scanFrame = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const videoWidth = videoRef.current.videoWidth
        const videoHeight = videoRef.current.videoHeight
        
        canvas.width = videoWidth
        canvas.height = videoHeight
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight)
        
        const imageData = context.getImageData(0, 0, videoWidth, videoHeight)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })
        
        if (code) {
          // Check if the code starts with our prefix
          if (code.data.startsWith('ramen-loyalty:')) {
            handleScan(code.data)
            return
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(scanFrame)
    }
    
    scanFrame()
  }

  // Stop scanning
  const stopScanning = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setScanning(false)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  // Handle scanned code
  const handleScan = async (code: string) => {
    stopScanning()
    setScannedCode(code)
    
    // Extract user ID from QR code
    const userId = code.replace('ramen-loyalty:', '')
    
    try {
      setLoading(true)
      // In a real app, fetch user data from API
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('User not found')
      }
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('ユーザーが見つかりませんでした')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle manual code input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode) return
    
    handleScan(`ramen-loyalty:${manualCode}`)
  }

  // Award points to user
  const awardPoints = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      await awardPointsToUser({
        userId: user.id,
        points: pointsToAdd,
        type: CreatePointTransactionDtoType.earn,
        description: '店舗での購入'
      })
      
      toast.success(`${pointsToAdd}ポイントを付与しました`)
      
      // Update user data with new points
      setUser({
        ...user,
        totalPoints: (user.totalPoints || 0) + pointsToAdd
      })
      
      // Reset for next scan
      setPointsToAdd(10)
      setScannedCode("")
    } catch (error) {
      console.error('Error awarding points:', error)
      toast.error('ポイント付与に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center">
        <Link href="/admin" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">QRコードスキャン</h1>
      </div>

      <Card>
        {scanning ? (
          <>
            <CardHeader>
              <CardTitle>QRコードをスキャン</CardTitle>
              <CardDescription>
                カメラにQRコードを映してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full rounded-md"
                  playsInline
                />
                <canvas 
                  ref={canvasRef} 
                  className="hidden"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={stopScanning}
              >
                キャンセル
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>ポイント付与</CardTitle>
              <CardDescription>
                QRコードをスキャンするか、ユーザーIDを入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!scannedCode ? (
                <div className="space-y-6">
                  <Button 
                    className="w-full h-32 flex flex-col gap-2"
                    onClick={startScanning}
                  >
                    <Camera className="h-8 w-8" />
                    <span>QRコードをスキャン</span>
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        または
                      </span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userId">ユーザーID</Label>
                      <Input 
                        id="userId"
                        placeholder="ユーザーIDを入力"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      検索
                    </Button>
                  </form>
                </div>
              ) : loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : user ? (
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">名前</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">現在のポイント</p>
                        <p className="font-medium">{user.totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">メール</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">電話番号</p>
                        <p className="font-medium">{user.phone || '未設定'}</p>
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
                        disabled={isMutating}
                      >
                        キャンセル
                      </Button>
                      <Button 
                        className="flex-1 gap-2"
                        onClick={awardPoints}
                        disabled={isMutating}
                      >
                        <Check className="h-4 w-4" />
                        ポイント付与
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-500">ユーザーが見つかりませんでした</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setScannedCode("")
                      setManualCode("")
                    }}
                  >
                    再試行
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
} 