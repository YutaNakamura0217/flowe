// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';

export interface AuthUser {
  username: string;
  imageUrl: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("https://127.0.0.1:8000/api/accounts/profile/", {
          method: "GET",
          credentials: "include", // セッションCookieを含む
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile) {
            // data.profile のキーはDjango側の実装に合わせる
            let imageUrl = data.profile.profile_image_url || "";
            const userData: AuthUser = {
              username: data.profile.display_name || "User",
              imageUrl,
            };
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("認証チェックエラー:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return { isAuthenticated, user, loading };
}
