"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuthControllerSignIn } from "@/lib/api/generated/auth/auth"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/contexts/AuthContext"

// SearchParamsを取得するためのラッパーコンポーネント
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirectTo") || "/"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const { trigger: signIn, isMutating } = useAuthControllerSignIn()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("メールアドレスとパスワードを入力してください")
      return
    }
    
    try {
      await signIn({
        email,
        password
      })
      
      toast.success("ログインしました")
      router.push(redirectTo)
    } catch (error) {
      console.error("Login error:", error)
      toast.error("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="example@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">パスワード</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isMutating}>
        {isMutating ? <LoadingSpinner /> : null}
        ログイン
      </Button>
    </form>
  )
}

export default function LoginPage() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (session) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ラーメン店ログイン</CardTitle>
          <CardDescription className="text-center">
            アカウント情報でログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center py-4"><LoadingSpinner /></div>}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            アカウントをお持ちでない方は
            <Button variant="link" className="p-0 h-auto font-normal" onClick={() => window.location.href = "/signup"}>
              新規登録
            </Button>
            してください
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

