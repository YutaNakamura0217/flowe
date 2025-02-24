"use client";
import { CommunityHeader } from "@/components/community-header";
import { CommunityTabs } from "@/components/community-tabs";
import { useEffect, useState } from "react";
import { NewPostModal } from "@/components/NewPostModal";
import { NewEventModal } from "@/components/NewEventModal";
import { Post } from "@/hooks/usePosts";

interface CommunityApiResponse {
  id: number;
  name: string;
  description: string;
  cover_image: string;
  members_count: number;
  is_member: boolean;
  events: any[];
}

interface PaginatedPosts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export default function CommunityPage({ params }: { params: { id: string } }) {
  const [communityData, setCommunityData] = useState<CommunityApiResponse | null>(
    null
  );
  const [posts, setPosts] = useState<PaginatedPosts>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  }); // Separate state for posts
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // モーダルの開閉フラグ
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const communityId = params.id;

  // コミュニティ詳細を取得
  const fetchCommunityData = async () => {
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/communities/${communityId}/`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`APIリクエストエラー: ${response.status}`);
        
      }
      const data: CommunityApiResponse = await response.json();
      setCommunityData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
        console.error("コミュニティ取得エラー:", e);
      } else {
        setError(new Error("不明なエラーが発生しました"));
        console.error("不明なエラー:", e);
      }
    }
  };

  // 投稿一覧を取得
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/posts/?community=${communityId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`APIリクエストエラー: ${response.status}`);
      }
      const data: PaginatedPosts = await response.json(); // Expect PaginatedPosts
      setPosts(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
        console.error("ポスト取得エラー:", e);
      } else {
        setError(new Error("不明なエラーが発生しました"));
        console.error("不明なエラー:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
    fetchPosts();
  }, [communityId]);

    // 新規投稿後のコールバック
    const handlePostCreated = () => {
        // ポスト一覧を再取得
        fetchPosts();
    }

  if (loading) {
    return <div>ロード中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (!communityData) {
    return <div>コミュニティが見つかりませんでした。</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <CommunityHeader community={communityData} onJoinLeave={fetchCommunityData} />

        <div className="container py-8">
          {/* コミュニティ未参加のとき */}
          {!communityData.is_member && (
            <div className="bg-white p-4 rounded-md shadow-md text-center">
              <p className="text-gray-600">
                このコミュニティに参加して、投稿やイベントを閲覧しましょう！
              </p>
            </div>
          )}

          {/* 参加している場合: ボタンを表示し、クリックでモーダルを開く */}
          {communityData.is_member && (
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setShowPostModal(true)}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
              >
                新規投稿
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                新規イベント
              </button>
            </div>
          )}

          {/* 投稿一覧・イベント一覧 */}
          <CommunityTabs posts={posts.results} events={communityData.events} />
        </div>
      </main>

      {/* 新規投稿モーダル */}
      <NewPostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPostCreated={handlePostCreated}
        communityId={communityId}
      />

      {/* 新規イベントモーダル */}
      <NewEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        communityId={parseInt(communityId)}
      />
    </div>
  );
}
