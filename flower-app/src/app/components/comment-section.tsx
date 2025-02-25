// src/app/components/comment-section.tsx
"use client";

import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";
import { useComments, Comment } from "@/hooks/useComments";

interface CommentSectionProps {
  resourceType: "event" | "post";
  resourceId: string;
  initialComments: Comment[];
}

export function CommentSection({
  resourceType,
  resourceId,
  initialComments,
}: CommentSectionProps) {
  // useComments フックを利用してコメント一覧と再取得関数を取得
  const { comments, fetchComments } = useComments(resourceType, resourceId, initialComments);

  // コメント投稿後に一覧を再フェッチするコールバック
  const handleCommentPosted = async (newCommentText: string) => {
    await fetchComments();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">コメント</h2>
      <CommentList comments={comments} />
      <CommentForm
        resourceType={resourceType}
        resourceId={resourceId}
        onCommentPosted={handleCommentPosted}
      />
    </div>
  );
}
