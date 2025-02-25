"use client";
import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/profile-header";
import { ProfileTabs } from "@/components/profile-tabs";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { User, PaginatedPosts, PaginatedCommunities } from "@/components/types";

// 既存のデータ取得関数はそのまま利用できますが、
// トップレベルで呼び出すのではなく useEffect で呼び出すようにします。
async function getUserData(userId: string) {
  console.log("getUserData 関数が呼び出されました");
  const userRes = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/`);
  if (!userRes.ok) {
    throw new Error(`Failed to fetch user data: ${userRes.status}`);
  }
  const userData = await userRes.json();

  const postsRes = await fetch(`https://127.0.0.1:8000/api/posts/?user=${userId}`, {
    credentials: "include",
  });
  if (!postsRes.ok) {
    throw new Error(`Failed to fetch user posts: ${postsRes.status}`);
  }
  const postsData = await postsRes.json();

  return { userData, postsData };
}

async function getUserCommunities(userId: string) {
  console.log("getUserCommunities 関数が呼び出されました");
  const commRes = await fetch(`https://127.0.0.1:8000/api/communities/user/${userId}/communities/`);
  if (!commRes.ok) {
    throw new Error(`Failed to fetch user communities: ${commRes.status}`);
  }
  const communitiesData = await commRes.json();
  return communitiesData;
}

async function getUserFavorites(userId: string) {
  console.log("getUserFavorites 関数が呼び出されました. userId:", userId);
  const favoritesRes = await fetch(`https://127.0.0.1:8000/api/posts/${userId}/favorites/`);
  if (!favoritesRes.ok) {
    throw new Error(`Failed to fetch user favorites: ${favoritesRes.status}`);
  }
  const favoritesData = await favoritesRes.json();
  return favoritesData;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  // ステートを用意
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PaginatedPosts | null>(null);
  const [favorites, setFavorites] = useState<PaginatedPosts | null>(null);
  const [communities, setCommunities] = useState<PaginatedCommunities | null>(null);

  // ローディング状態・エラー状態を持っておくとUXが向上します
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ページがマウント（もしくは params.id が変わった）時にデータを取得する
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // 1. ユーザーメインデータと投稿一覧
        const { userData, postsData } = await getUserData(params.id);
        // 2. コミュニティ一覧
        const communitiesData = await getUserCommunities(params.id);
        // 3. お気に入り一覧
        const favoritesData = await getUserFavorites(params.id);

        // データを整形してステートに保存
        const user: User = {
          id: userData.id,
          username: userData.display_name || userData.username,
          email: userData.email,
          profile: {
            bio: userData.profile?.bio || "",
            cover_image: userData.profile?.cover_image || "/placeholder.svg?cover",
            profile_image: userData.profile?.profile_image || "/placeholder-avatar.svg",
          },
          posts_count: userData.posts_count,
          followers_count: userData.followers_count,
          following_count: userData.following_count,
        };

        const posts: PaginatedPosts = {
          count: postsData.count,
          next: postsData.next,
          previous: postsData.previous,
          results: postsData.results.map((item: any) => ({
            id: item.id,
            image_url: item.image_url,
            caption: item.caption,
            likes: item.likes,
            comments: item.comments,
            user: {
              id: item.user.id,
              username: item.user.username,
              email: item.user.email,
              profile: {
                bio: "",
                cover_image: "",
                profile_image: "",
              },
              posts_count: 0,
              followers_count: 0,
              following_count: 0,
            },
            created_at: item.created_at,
            updated_at: item.updated_at,
            tags: item.tags,
            variety_name: item.variety_name,
            location: item.location,
            public_status: item.public_status,
          })),
        };

        const favorites: PaginatedPosts = {
          count: favoritesData.count,
          next: favoritesData.next,
          previous: favoritesData.previous,
          results: favoritesData.results.map((item: any) => ({
            id: item.id,
            image_url: item.image_url,
            caption: item.caption,
            likes: item.likes,
            comments: item.comments,
            user: {
              id: item.user.id,
              username: item.user.username,
              email: "",
              profile: {
                bio: "",
                cover_image: "",
                profile_image: "",
              },
              posts_count: 0,
              followers_count: 0,
              following_count: 0,
            },
            created_at: item.created_at,
            updated_at: item.updated_at,
            tags: item.tags,
            variety_name: item.variety_name,
            location: item.location,
            public_status: item.public_status,
          })),
        };

        const communities: PaginatedCommunities = {
          count: communitiesData.count,
          next: communitiesData.next,
          previous: communitiesData.previous,
          results: communitiesData.results.map((c: any) => ({
            id: c.id,
            name: c.name,
            memberCount: c.memberCount || 0,
            cover_image: c.cover_image || null,
          })),
        };

        // ステート更新
        setUser(user);
        setPosts(posts);
        setFavorites(favorites);
        setCommunities(communities);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "データ取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    // 実行
    fetchData();
  }, [params.id]);

  // ローディング中
  if (loading) {
    return <ProfileSkeleton />;
  }

  // エラー時
  if (error) {
    return <div className="text-red-500">エラーが発生しました: {error}</div>;
  }

  // データ取得後、万が一 null のままの場合
  if (!user || !posts || !favorites || !communities) {
    return <div>データが見つかりませんでした。</div>;
  }

  // 正常表示
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ProfileHeader user={user} />
        <div className="container py-8">
          <ProfileTabs posts={posts} favorites={favorites} communities={communities} />
        </div>
      </main>
    </div>
  );
}
