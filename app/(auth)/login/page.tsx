"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, session, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams?.get("registered")

  useEffect(() => {
    if (session && !loading) {
      router.push("/")
    }
  }, [session, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。")
        return
      }
      
      router.push("/")
    } catch (err) {
      setError("ログイン中にエラーが発生しました。")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">おかえりなさい</h1>
          <p className="mt-2 text-gray-600">麺ポイントアカウントにログイン</p>
          {registered && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
              登録が完了しました。ログインしてください。
            </div>
          )}
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                placeholder="メールアドレス"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                placeholder="パスワード"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？{" "}
            <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

