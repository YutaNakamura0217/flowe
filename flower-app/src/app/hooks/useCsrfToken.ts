// src/app/hooks/useCsrfToken.ts
"use client";

import { useEffect, useState } from "react";

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    async function fetchCsrf() {
      try {
        const res = await fetch("https://127.0.0.1:8000/api/accounts/csrf/", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch CSRF token");
        }
        const data = await res.json();
        console.log("CSRF Token fetched:", data.csrfToken);
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("CSRF token fetch error:", error);
      }
    }
    fetchCsrf();
  }, []);

  return csrfToken;
}
