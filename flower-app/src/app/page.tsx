// src/app/page.tsx
"use client";
import { PostCard } from "@/components/post-card";
import { Sidebar } from "@/components/sidebar";
import { FloatingActionButton } from "@/components/floating-action-button";
import { PostCardSkeleton } from "@/components/PostCardSkeleton";

import { usePosts } from "@/hooks/usePosts";
import { useCommunities } from "@/hooks/useCommunities";
import { useEvents } from "@/hooks/useEvents";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// URLからページ番号を抽出するヘルパー関数
const getPageNumberFromUrl = (url: string | null): number => {
  if (!url) {
    return 1;
  }
  const match = url.match(/page=(\d+)/);
  return match ? parseInt(match[1]) : 1;
};

export default function HomePage() {
  const csrfToken = useCsrfToken();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // 投稿のカスタムフック
  const { posts, postData, setCurrentPage } = usePosts();

  // コミュニティのカスタムフック
  const { communities, fetchCommunities } = useCommunities();

  // イベントのカスタムフック (pass csrfToken correctly!)
  const { events, fetchEvents } = useEvents(csrfToken);

  // Add a state to track if we've already checked authentication
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only redirect if we've checked authentication and the user is not authenticated
    if (!loading && !isAuthenticated && authChecked) {
      router.push("/login");
    }
    
    // Mark that we've checked authentication
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading, isAuthenticated, router, authChecked]);

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <section className="relative w-full h-64 mb-8 overflow-hidden bg-gray-200">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-1/2">
              <PostCardSkeleton />
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* メインカラム */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))}
            </div>
          </div>

          {/* サイドバー */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              {/* サイドバースケルトン */}
              <div className="space-y-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative w-full h-64 mb-8 overflow-hidden">
        <img
          src="/assets/hero-image.jpg"
          alt="季節のおすすめ"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl text-white font-bold mb-2">
            Flower Friendsへようこそ
          </h1>
          <p className="text-lg text-white">あなたの花の物語をシェアしよう</p>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* メインカラム */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-6">
            {posts.length === 0 ? (
              // 投稿データがロード中の場合はスケルトン表示
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))
            ) : (
              // 投稿データがある場合は通常表示
              posts.map((post) => (
                <PostCard key={post.id} post={post} csrfToken={csrfToken} />
              ))
            )}
          </div>
        
          {/* ページネーション */}
          {postData && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  setCurrentPage(getPageNumberFromUrl(postData.previous))
                }
                disabled={!postData.previous}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() => setCurrentPage(getPageNumberFromUrl(postData.next))}
                disabled={!postData.next}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </div>


        {/* サイドバー */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-8">
            <Sidebar communities={communities} events={events} />
          </div>
        </div>
      </div>

      {/* FAB → 新規投稿モーダル → 投稿完了時に fetchPosts() を呼ぶ */}
      <FloatingActionButton onPostCreated={() => setCurrentPage(1)} />
    </div>
  );
}
