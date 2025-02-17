"use client";
import { PostCard } from "@/components/post-card";
import { Sidebar } from "@/components/sidebar";
import { FloatingActionButton } from "@/components/floating-action-button";

import { usePosts } from "@/hooks/usePosts";
import { useCommunities } from "@/hooks/useCommunities";
import { useEvents } from "@/hooks/useEvents";

export default function HomePage() {
  // 投稿のカスタムフック
  const { posts, fetchPosts } = usePosts();

  // コミュニティのカスタムフック
  const { communities, fetchCommunities } = useCommunities();

  // イベントのカスタムフック
  const { events, fetchEvents } = useEvents();


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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* サイドバー */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-8">
            <Sidebar communities={communities} events={events} />
          </div>
        </div>
      </div>

      {/* FAB → 新規投稿モーダル → 投稿完了時に fetchPosts() を呼ぶ */}
      <FloatingActionButton onPostCreated={fetchPosts} />
    </div>
  );
}
