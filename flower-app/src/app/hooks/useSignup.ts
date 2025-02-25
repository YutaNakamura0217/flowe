// src/app/hooks/useSignup.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { useAuth } from "@/contexts/AuthContext";

interface SignupPayload {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export function useSignup() {
  const router = useRouter();
  const csrfToken = useCsrfToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshAuth } = useAuth();

  const signup = useCallback(
    async (payload: SignupPayload) => {
      if (!csrfToken) {
        setError("CSRFトークンが取得できません。ページをリロードしてください。");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://127.0.0.1:8000/api/accounts/signup/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // サインアップ成功時はログインページへ遷移
          // 新しいCSRFトークンを取得してからリダイレクト
          try {
            // Add a timestamp query parameter for cache busting instead of headers
            const timestamp = new Date().getTime();
            await fetch(`https://127.0.0.1:8000/api/accounts/csrf/?_=${timestamp}`, {
              credentials: "include"
            });
            console.log("CSRF token refreshed after signup");
            // Refresh auth state to ensure it's up to date
            await refreshAuth();
          } catch (error) {
            console.error("Failed to refresh CSRF token after signup:", error);
          }
          
          router.push("/login");
        } else {
          setError(JSON.stringify(data.errors || data.error));
        }
      } catch (err: any) {
        console.error("サインアップ中のエラー:", err);
        setError("サインアップ中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    },
    [router, csrfToken, refreshAuth]
  );

  return { signup, loading, error };
}
