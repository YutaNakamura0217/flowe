// src/app/hooks/usePostLike.ts
"use client";

import { useState, useCallback } from "react";
import { useToggleLike } from "@/hooks/useToggleLike";

interface ToggleLikeResult {
  likes_count: number;
}

export function usePostLike(postId: number, initialLikes: number, csrfToken: string) {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { toggleLike, isLoading, error } = useToggleLike();

  const handleLike = useCallback(async () => {
    const result: ToggleLikeResult | null = await toggleLike(postId, csrfToken);
    if (result) {
      setLikesCount(result.likes_count);
    }
  }, [postId, csrfToken, toggleLike]);

  return { likesCount, handleLike, isLoading, error };
}
