"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCsrfToken } from "@/hooks/useCsrfToken";

interface CommentFormProps {
  resourceType: "event" | "post";
  resourceId: string;
  onCommentPosted: (newCommentText: string) => Promise<void>;
}

export function CommentForm({
  resourceType,
  resourceId,
  onCommentPosted,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const csrfToken = useCsrfToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        // resourceTypeに応じてURLを切り替える例
        const url =
          resourceType === "event"
            ? `https://127.0.0.1:8000/api/events/${resourceId}/comments/`
            : `https://127.0.0.1:8000/api/posts/${resourceId}/comments/`;

        const res = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({ text: comment }), // フィールド名に合わせる
        });
        if (!res.ok) {
          throw new Error("Failed to post comment");
        }

        // 投稿成功後、コールバックを呼ぶ（コメント一覧の再取得など）
        onCommentPosted(comment);
      } catch (error) {
        console.error(error);
      }
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="コメントを入力..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={!comment.trim()}>
        コメントを投稿
      </Button>
    </form>
  );
}
