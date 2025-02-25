"use client";

import { useEffect } from "react";
import { LoginForm } from "@/components/login-form";

// Force a fresh CSRF token fetch when the login page loads
export default function LoginPage() {
  useEffect(() => {
    // Fetch a fresh CSRF token when the login page loads
    const fetchCsrf = async () => {
      try {
        // Add a timestamp query parameter for cache busting instead of headers
        const timestamp = new Date().getTime();
        await fetch(`https://127.0.0.1:8000/api/accounts/csrf/?_=${timestamp}`, {
          credentials: "include"
        });
        console.log("CSRF token refreshed on login page load");
      } catch (error) {
        console.error("Failed to refresh CSRF token:", error);
      }
    };
    
    fetchCsrf();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">ログイン</h1>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
