"use client";

import { useState, useCallback } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

export interface CreatePostData {
  caption: string;
  image?: File;
  tags?: string[];
}

export function useCreatePost() {
  const csrfToken = useCsrfToken();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(
    async (data: CreatePostData): Promise<void> => {
      setSubmitting(true);
      setError(null);

      try {
        const formData = new FormData();
        if (data.image) {
          formData.append("image_url", data.image);
        }
        formData.append("caption", data.caption);
        if (data.tags && data.tags.length > 0) {
          data.tags.forEach((tag) => formData.append("tags", tag));
        }

        const response = await fetch("https://127.0.0.1:8000/api/posts/", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`投稿に失敗しました (status: ${response.status})`);
        }
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [csrfToken]
  );

  return { createPost, submitting, error };
}
