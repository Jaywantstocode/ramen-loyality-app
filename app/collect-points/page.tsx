"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Share2 } from "lucide-react"

export default function CollectPointsPage() {
  const [qrCode, setQrCode] = useState("")
  const [expiryTime, setExpiryTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [canShare, setCanShare] = useState(false)

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  // Generate a unique QR code that expires after 5 minutes
  const generateQRCode = () => {
    // In a real app, this would be a secure token from the backend
    // For this example, we'll use a timestamp + random string
    const uniqueCode = `LOYALTY-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    setQrCode(uniqueCode)
    
    // Set expiry time to 5 minutes from now
    const expiry = Date.now() + 5 * 60 * 1000
    setExpiryTime(expiry)
  }

  // Update timer every second
  useEffect(() => {
    if (!expiryTime) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, expiryTime - Date.now())
      setTimeLeft(remaining)
      
      // Regenerate QR code when expired
      if (remaining === 0) {
        clearInterval(interval)
        setQrCode("")
        setExpiryTime(null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiryTime])

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    if (!timeLeft) return "00:00"
    const minutes = Math.floor(timeLeft / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Share QR code (for mobile)
  const shareQRCode = async () => {
    if (!qrCode || !navigator.share) return
    
    try {
      await navigator.share({
        title: 'My Loyalty QR Code',
        text: 'Scan this code to give me points!',
        url: `https://example.com/qr/${qrCode}` // In a real app, this would be a shareable link
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">ポイント獲得</h1>
      
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">QRコードを表示</CardTitle>
          <CardDescription>店舗でこのコードを提示してポイントを獲得</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          <div className="relative">
            {qrCode ? (
              <>
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <QRCodeSVG 
                    value={qrCode} 
                    size={250}
                    level="H" // High error correction for better scanning
                    includeMargin={true}
                  />
                </div>
                
                {/* Expiry timer */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  {formatTimeLeft()}
                </div>
              </>
            ) : (
              <div className="w-[250px] h-[250px] bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-2">QRコードが生成されていません</p>
                <Button 
                  onClick={generateQRCode}
                  className="mt-2"
                >
                  QRコードを生成
                </Button>
              </div>
            )}
          </div>
          
          {qrCode && (
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={generateQRCode}
              >
                <RefreshCw className="h-4 w-4" />
                再生成
              </Button>
              
              {/* Only show share button if Web Share API is available (mobile) */}
              {canShare && (
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={shareQRCode}
                >
                  <Share2 className="h-4 w-4" />
                  共有
                </Button>
              )}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground text-center mt-4">
            <p>セキュリティのため、QRコードは5分後に期限切れになります</p>
            <p className="mt-1">店舗スタッフにスキャンしてもらってください</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

