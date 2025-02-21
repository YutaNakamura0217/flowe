
"use client";
import { Header } from "@/components/header";
import { CommunityHeader } from "@/components/community-header";
import { CommunityTabs } from "@/components/community-tabs";
import { useEffect, useState } from "react";
import NewPostForm from "@/components/NewPostForm";

// APIレスポンスの型定義 (必要に応じて詳細化)
interface CommunityApiResponse {
  id: number;
  name: string;
  description: string;
  cover_image: string;
  members_count: number;
  is_member: boolean;
  events: any[];
}

interface Post {
    id: number;
    user: any; // Replace 'any' with a more specific type if you have one
    image_url: string;
    caption: string;
    likes: number;
    comments: number;
    created_at: string; // Or Date if you want to work with Date objects
    updated_at: string; // Or Date
    tags: string[]; // Assuming tags are strings
    variety_name: string;
    location: string;
    public_status: string;
}

export default function CommunityPage({ params }: { params: { id: string } }) {
  const [communityData, setCommunityData] = useState<CommunityApiResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]); // Separate state for posts
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const communityId = params.id;

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
      const data: CommunityApiResponse = (await response.json()) as CommunityApiResponse;
      setCommunityData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
        console.error("データ取得中にエラーが発生しました:", e);
      } else {
        setError(new Error("不明なエラーが発生しました"));
        console.error("不明なエラーが発生しました:", e);
      }
    }
  };

    const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/posts/community/${communityId}/`,  // Use the new endpoint
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`APIリクエストエラー: ${response.status}`);
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
        console.error("データ取得中にエラーが発生しました:", e);
      } else {
        setError(new Error("不明なエラーが発生しました"));
        console.error("不明なエラーが発生しました:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
    fetchPosts();
  }, [communityId]);

    const handlePostCreated = () => {
    // Refetch posts after a new post is created
    fetchPosts();
  };

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
    <CommunityHeader community={communityData} onJoinLeave={fetchCommunityData} /> {/* Pass the callback */}
    <div className="container py-8">
     {communityData.is_member && (
      <NewPostForm communityId={communityId} onPostCreated={handlePostCreated} />
     )}
     <CommunityTabs posts={posts} events={communityData.events} />
    </div>
   </main>
  </div>
 );
}
