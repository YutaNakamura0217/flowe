"use client";
// src/app/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface AuthUser {
  username: string;
  imageUrl: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  refreshAuth: () => Promise<void>; // Add a function to refresh auth state
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  refreshAuth: async () => {}, // Default empty function
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to check authentication status
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const res = await fetch(`https://127.0.0.1:8000/api/accounts/profile/?_=${timestamp}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          const userData: AuthUser = {
            username: data.profile.display_name || "User",
            imageUrl: data.profile.profile_image_url || "",
          };
          setIsAuthenticated(true);
          setUser(userData);
          console.log("Authentication successful, user:", userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          console.log("Authentication failed: profile data missing");
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        console.log("Authentication failed: API response not OK");
      }
    } catch (error) {
      console.error("認証チェックエラー:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to refresh authentication status - can be called after login
  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
