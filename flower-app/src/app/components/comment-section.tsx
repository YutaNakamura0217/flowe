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

// 追加: ページネーションされたコメントレスポンス
interface PaginatedComments {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommentAPIResponse[];
}

interface CommentSectionProps {
  resourceType: "event" | "post"; // イベントか投稿かを示す
  resourceId: string;            // ID
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
    const url =
      resourceType === "event"
        ? `https://127.0.0.1:8000/api/events/${resourceId}/comments/`
        : `https://127.0.0.1:8000/api/posts/${resourceId}/comments/`;

    const res = await fetch(url, { cache: "no-cache" });
    if (res.ok) {
      // ページネーション形式を受け取る
      const data: PaginatedComments = await res.json();
      // data.resultsが実際のコメント配列
      const commentsData = data.results; 

      // results配列をmap
      const newComments = commentsData.map((c) => ({
        id: c.id.toString(),
        user: {
          name: c.user.display_name || c.user.username,
          profile_image: c.user.profile_image || "/placeholder.svg?user",
        },
        text: c.text,
        createdAt: c.created_at,
        likes: 0, // likesがあれば適宜調整
      }));

      setComments(newComments);
    }
  };

  const handleCommentPosted = async (newCommentText: string) => {
    // 送信した後、再フェッチなどを行う想定
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
