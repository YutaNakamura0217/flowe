"use client";

import { useState } from "react";
import Link from "next/link";
import { Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Try to login
    const result = await login({ email, password });
    
    // If there was a CSRF token error, try to refresh the page
    if (result === "csrf_error") {
      // Force a CSRF token refresh
      try {
        // Add a timestamp query parameter for cache busting instead of headers
        const timestamp = new Date().getTime();
        const res = await fetch(`https://127.0.0.1:8000/api/accounts/csrf/?_=${timestamp}`, {
          credentials: "include"
        });
        if (res.ok) {
          // Try login again after a short delay
          setTimeout(async () => {
            const loginResult = await login({ email, password });
            if (loginResult !== "csrf_error") {
              // Force refresh auth state
              await refreshAuth();
            }
          }, 500);
        }
      } catch (error) {
        console.error("CSRF refresh error:", error);
      }
    }
  };

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
          <Button type="submit" className="w-full" disabled={loading}>
            ログイン
          </Button>
          {error && <p className="text-red-500">{error}</p>}
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
  );
}
