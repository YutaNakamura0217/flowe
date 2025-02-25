"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePostComment } from "@/hooks/usePostComment";

interface CommentFormProps {
  resourceType: "event" | "post";
  resourceId: string;
  onCommentPosted: (newCommentText: string) => Promise<void>;
}

export function CommentForm({ resourceType, resourceId, onCommentPosted }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const { postComment, loading, error } = usePostComment({ resourceType, resourceId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        await postComment(comment);
        // 投稿成功後のコールバック（コメント一覧の再取得等）
        await onCommentPosted(comment);
      } catch (err) {
        console.error("コメント投稿に失敗しました:", err);
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
      <Button type="submit" disabled={loading || !comment.trim()}>
        {loading ? "投稿中…" : "コメントを投稿"}
      </Button>
      {error && <p className="text-red-500">エラー: {error.message}</p>}
    </form>
  );
}
