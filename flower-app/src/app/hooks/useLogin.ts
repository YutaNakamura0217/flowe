"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { useAuth } from "@/contexts/AuthContext";

interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const csrfToken = useCsrfToken();
  const { refreshAuth } = useAuth();

  const login = useCallback(
    async ({ email, password }: LoginPayload): Promise<string | void> => {
      // CSRFトークンが取得できていない場合はエラーを返す（必要に応じてリトライ処理なども検討）
      if (!csrfToken) {
        setError("CSRFトークンが取得できません。ページをリロードしてください。");
        return "csrf_error";
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://127.0.0.1:8000/api/accounts/login/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Refresh authentication state before redirecting
          await refreshAuth();
          router.push("/");
        } else if (res.status === 403) {
          // 403エラーはCSRFトークンの問題と判断
          setError("CSRFトークンが無効です。再試行します...");
          return "csrf_error";
        } else {
          setError(data.error || "不明なエラー");
        }
      } catch (error) {
        console.error("ログイン中のエラー:", error);
        setError("ログイン中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    },
    [router, csrfToken, refreshAuth]
  );

  return { login, loading, error };
}
