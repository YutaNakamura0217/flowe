"use client";

import { useState, useCallback } from "react";
import { PostCard } from "./post-card";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { Post } from "@/hooks/usePosts";

export interface PaginatedPosts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

// プロパティ名を postData に変更
interface PostListProps {
  postData: PaginatedPosts;
}

/**
 * PostList内で「次へ」「前へ」ボタンを設置して再度Fetchする例
 */
export function PostList({ postData: initialPostData }: PostListProps) {
  const csrfToken = useCsrfToken();

  // 親から受け取ったページネーションデータを、PostList内部で持ち直す
  const [postData, setPostData] = useState<PaginatedPosts>(initialPostData);

  // fetch関数
  const fetchNewPage = useCallback(async (url: string) => {
    try {
      // 次ページ or 前ページのURLを使って再度fetch
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status}`);
      }
      const data = (await res.json()) as PaginatedPosts;
      setPostData(data);
    } catch (err) {
      console.error("Error fetching new page:", err);
    }
  }, []);

  const handleNextPage = () => {
    if (postData.next) {
      fetchNewPage(postData.next);
    }
  };

  const handlePrevPage = () => {
    if (postData.previous) {
      fetchNewPage(postData.previous);
    }
  };

  return (
    <div className="space-y-4">
      {/* 投稿一覧 */}
      {postData.results.map((post) => (
        <PostCard key={post.id} post={post} csrfToken={csrfToken} />
      ))}

      {/* ページネーションUI */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={!postData.previous}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          前へ
        </button>
        <button
          onClick={handleNextPage}
          disabled={!postData.next}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
