// comment-section.tsx
"use client";

import { useState, useEffect } from "react";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";

interface Comment {
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

interface CommentSectionProps {
  resourceType: "event" | "post";  // イベントか投稿かを示す
  resourceId: string;             // ID
  initialComments: Comment[];
}

export function CommentSection({
  resourceType,
  resourceId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // コメント一覧を再フェッチする関数（更新用）
  const fetchComments = async () => {
    // イベント or 投稿かでURLを変える
    const url =
      resourceType === "event"
        ? `https://127.0.0.1:8000/api/events/${resourceId}/comments/`
        : `https://127.0.0.1:8000/api/posts/${resourceId}/comments/`;

    const res = await fetch(url, { cache: "no-cache" });
    if (res.ok) {
      const commentsData: CommentAPIResponse[] = await res.json();
      const newComments = commentsData.map((c) => ({
        id: c.id.toString(),
        user: {
          name: c.user.display_name || c.user.username,
          profile_image: c.user.profile_image || "/placeholder.svg?user",
        },
        text: c.text,
        createdAt: c.created_at,
        likes: 0, // イベントのCommentsAPIにlikesがあればここを調整
      }));
      setComments(newComments);
    }
  };

  // 新規コメント送信後に再フェッチ
  const handleCommentPosted = async (newCommentText: string) => {
    await fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [resourceType, resourceId]);

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
