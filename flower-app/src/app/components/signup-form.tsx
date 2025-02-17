"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Flower } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // パスワードと確認用パスワードが一致しているかチェック
    if (password !== confirmPassword) {
      alert("パスワードが一致しません")
      return
    }

    // Django の UserCreationForm は通常、username / password1 / password2 を期待します。
    // メールアドレスを username として使うため、username フィールドに email の値を渡します。
    const payload = {
      username: email,
      email: email,
      password1: password,
      password2: confirmPassword,
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        // サインアップ成功時はログイン画面へ遷移など、お好みの処理
        router.push("/login")
      } else {
        // バックエンド側でのエラーを表示
        alert("サインアップに失敗しました: " + JSON.stringify(data.errors || data.error))
      }
    } catch (error) {
      console.error("サインアップ中のエラー:", error)
      alert("サインアップ中にエラーが発生しました")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Flower className="w-12 h-12 mx-auto text-pink-400" />
        <h2 className="text-2xl font-semibold mt-2">Flower Friends へようこそ</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
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
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              パスワード（確認）
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            アカウント作成
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-pink-500 hover:underline">
            ログイン
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
