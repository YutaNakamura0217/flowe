// src/app/hooks/useProfile.ts
"use client";

import { useState, useEffect } from "react";

export interface ProfileData {
  display_name?: string;
  bio?: string;
  profile_image_url?: string | null;
  cover_image_url?: string | null;
  // 必要に応じて他のプロパティも追加
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://127.0.0.1:8000/api/accounts/profile/", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else {
          console.error("Fetching profile failed:", res.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return { profile, loading };
}
