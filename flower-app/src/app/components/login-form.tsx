"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Flower } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type React from "react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      email,
      password,
    }

    try {
      const res = await fetch("https://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })      
      const data = await res.json()
      if (res.ok && data.success) {
        // ログイン成功後、マイページへ遷移
        router.push("/mypage")
      } else {
        alert("ログインに失敗しました: " + (data.error || "不明なエラー"))
      }
    } catch (error) {
      console.error("ログイン中のエラー:", error)
      alert("ログイン中にエラーが発生しました")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Flower className="w-12 h-12 mx-auto text-pink-400" />
        <h2 className="text-2xl font-semibold mt-2">Flower Friendsへようこそ</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス（ユーザー名）
            </label>
            <Input
              id="email"
              type="text"
              placeholder="yourusername@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              パスワード
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-pink-500 hover:underline">
            新規登録
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}


