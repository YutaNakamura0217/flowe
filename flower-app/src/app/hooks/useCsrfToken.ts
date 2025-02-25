// src/app/hooks/useCsrfToken.ts
"use client";

import { useEffect, useState, useCallback } from "react";

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState("");

  const fetchCsrf = useCallback(async () => {
    try {
      // Add a timestamp query parameter for cache busting instead of headers
      const timestamp = new Date().getTime();
      const res = await fetch(`https://127.0.0.1:8000/api/accounts/csrf/?_=${timestamp}`, {
        credentials: "include"
      });
      if (!res.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      const data = await res.json();
      console.log("CSRF Token fetched:", data.csrfToken);
      setCsrfToken(data.csrfToken);
      return data.csrfToken;
    } catch (error) {
      console.error("CSRF token fetch error:", error);
      return "";
    }
  }, []);

  useEffect(() => {
    fetchCsrf();
  }, [fetchCsrf]);

  return csrfToken;
}
