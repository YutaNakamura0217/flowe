"use client";

import { useState, useCallback } from "react";
interface ToggleLikeResult {
  message: string;
  likes_count: number;
}

/**
 * いいね(Toggle)するカスタムフック
 *
 * @returns {Object} { toggleLike, isLoading, error }
 */
export function useToggleLike() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * いいねのトグル処理
   * @param {number} postId いいねを操作する投稿ID
   * @param {string} csrfToken CSRFトークン
   * @returns {Promise<ToggleLikeResult | null>}
   */
  const toggleLike = useCallback(
    async (postId: number, csrfToken: string): Promise<ToggleLikeResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://127.0.0.1:8000/api/posts/${postId}/like/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to toggle like: ${response.status} (${response.statusText})`);
        }

        const data: ToggleLikeResult = await response.json();

        return data;
      } catch (err: any) {
        setError(err);
        console.error("Error toggling like:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [] // Removed csrfToken from dependency array
  );

  return {
    toggleLike,
    isLoading,
    error,
  };
}
