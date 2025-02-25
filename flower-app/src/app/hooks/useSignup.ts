// src/app/hooks/useSignup.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCsrfToken } from "@/hooks/useCsrfToken";

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
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // サインアップ成功時はログインページへ遷移
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
    [router, csrfToken]
  );

  return { signup, loading, error };
}
