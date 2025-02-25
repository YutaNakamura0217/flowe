// src/app/hooks/useComments.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface Comment {
  id: string;
  user: {
    name: string;
    profile_image: string;
  };
  text: string;
  createdAt: string;
  likes: number;
}

interface CommentAPIResponse {
  id: number;
  user: {
    id: number;
    username: string;
    display_name: string | null;
    profile_image: string | null;
  };
  text: string;
  created_at: string;
}

interface PaginatedComments {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommentAPIResponse[];
}

/**
 * useComments
 * resourceType と resourceId に応じたコメント一覧を取得し、state と再フェッチ関数を返す
 */
export function useComments(
  resourceType: "event" | "post",
  resourceId: string,
  initialComments: Comment[] = []
) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const url =
      resourceType === "event"
        ? `https://127.0.0.1:8000/api/events/${resourceId}/comments/`
        : `https://127.0.0.1:8000/api/posts/${resourceId}/comments/`;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (res.ok) {
        const data: PaginatedComments = await res.json();
        const newComments = data.results.map((c) => ({
          id: c.id.toString(),
          user: {
            name: c.user.display_name || c.user.username,
            profile_image: c.user.profile_image || "/placeholder.svg?user",
          },
          text: c.text,
          createdAt: c.created_at,
          likes: 0, // 必要に応じて調整
        }));
        setComments(newComments);
      } else {
        console.error("コメントの取得に失敗:", res.statusText);
      }
    } catch (error) {
      console.error("コメント取得中にエラーが発生しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resourceType, resourceId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, fetchComments, isLoading };
}
