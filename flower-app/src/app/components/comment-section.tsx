// components/comment-section.tsx
"use client";

import { useState } from "react";
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
  likes: number;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // コメント一覧を再フェッチする関数（更新用）
  const fetchComments = async () => {
    const res = await fetch(`https://127.0.0.1:8000/api/posts/${postId}/comments/`, { cache: "no-cache" });
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
        likes: c.likes,
      }));
      setComments(newComments);
    }
  };

  // CommentFormから呼ばれるハンドラ
  const handleCommentPosted = async (newCommentText: string) => {
    // 新規コメントを投稿した後、最新のコメント一覧を取得
    await fetchComments();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">コメント</h2>
      <CommentList comments={comments} />
      <CommentForm postId={postId} onCommentPosted={handleCommentPosted} />
    </div>
  );
}

