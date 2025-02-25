// src/app/hooks/useUpdateProfile.ts
"use client";

import { useState, useCallback } from "react";

export type UpdateProfileData = {
  displayName: string;
  bio: string;
  profileImage?: File | null;
  coverImage?: File | null;
};

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);

    // FormData に各値を追加
    const formData = new FormData();
    formData.append("display_name", data.displayName);
    formData.append("bio", data.bio);
    if (data.profileImage) {
      formData.append("profile_image", data.profileImage);
    }
    if (data.coverImage) {
      formData.append("cover_image", data.coverImage);
    }

    try {
      const res = await fetch("https://127.0.0.1:8000/api/accounts/update_profile/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const responseData = await res.json();
      if (res.ok && responseData.success) {
        return responseData;
      } else {
        throw new Error("プロフィール更新エラー: " + JSON.stringify(responseData));
      }
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateProfile, isLoading, error };
}
