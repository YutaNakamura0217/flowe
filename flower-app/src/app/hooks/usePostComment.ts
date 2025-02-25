"use client";
import { useState, useCallback } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

interface UsePostCommentProps {
  resourceType: "event" | "post";
  resourceId: string;
}

export function usePostComment({ resourceType, resourceId }: UsePostCommentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const csrfToken = useCsrfToken();

  const postComment = useCallback(
    async (comment: string) => {
      if (!csrfToken) {
        throw new Error("CSRF token is not available. Please reload the page.");
      }
      setLoading(true);
      setError(null);
      try {
        const url =
          resourceType === "event"
            ? `https://127.0.0.1:8000/api/events/${resourceId}/comments/`
            : `https://127.0.0.1:8000/api/posts/${resourceId}/comments/`;

        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({ text: comment }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to post comment");
        }
        return await response.json();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [resourceType, resourceId, csrfToken]
  );

  return { postComment, loading, error };
}
