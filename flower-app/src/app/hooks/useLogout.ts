// src/app/hooks/useLogout.ts
"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

export function useLogout() {
  const router = useRouter();
  const csrfToken = useCsrfToken();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const logout = useCallback(async () => {
    if (!csrfToken) {
      setError(new Error("CSRFトークンが取得できません。ページをリロードしてください。"));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("https://127.0.0.1:8000/api/accounts/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });
      if (res.ok) {
        router.push("/login");
      } else {
        throw new Error("Logout failed: " + res.status);
      }
    } catch (err: any) {
      console.error("Error during logout:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [csrfToken, router]);

  return { logout, isLoading, error };
}
