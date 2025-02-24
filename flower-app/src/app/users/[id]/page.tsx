"use client";
// app/users/[id]/page.tsx
import { ProfileHeader } from "@/components/profile-header";
import { ProfileTabs } from "@/components/profile-tabs";

interface User {
  id: number;
  username: string;
  email: string;
  profile: {   
    bio: string;
    cover_image: string;
    profile_image: string;
  };
  posts_count: number;
  followers_count: number;
  following_count: number;
}
interface Post {
  id: number;
  image_url: string;
  caption: string;
  likes: number;
  comments: number;
  user: User;
  created_at: string;
  updated_at: string;
  tags: string[];
  variety_name: string;
  location: string;
  public_status: boolean;
}

// コミュニティの型例
interface Community {
  id: number;
  name: string;
  memberCount: number;
  cover_image: string | null;
}

async function getUserData(userId: string) {
  console.log("getUserData 関数が呼び出されました");
  const userRes = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/`);
  if (!userRes.ok) {
    throw new Error(`Failed to fetch user data: ${userRes.status}`);
  }
  const userData = await userRes.json();

  const postsRes = await fetch(`https://127.0.0.1:8000/api/posts/?user=${userId}`);
  if (!postsRes.ok) {
    throw new Error(`Failed to fetch user posts: ${postsRes.status}`);
  }
  const postsData = await postsRes.json();

  return { userData, postsData };
}

// ユーザーが所属するコミュニティ一覧を取得する関数
async function getUserCommunities(userId: string) {
  console.log("getUserCommunities 関数が呼び出されました");
  const commRes = await fetch(`https://127.0.0.1:8000/api/communities/user/${userId}/communities/`);
  if (!commRes.ok) {
    throw new Error(`Failed to fetch user communities: ${commRes.status}`);
  }
  const communitiesData = await commRes.json();
  return communitiesData;
}

// ユーザーがいいねした投稿一覧を取得する関数
async function getUserFavorites(userId: string) {
  console.log("getUserFavorites 関数が呼び出されました. userId:", userId);
  const favoritesRes = await fetch(`https://127.0.0.1:8000/api/posts/${userId}/favorites/`);
  if (!favoritesRes.ok) {
    throw new Error(`Failed to fetch user favorites: ${favoritesRes.status}`);
  }
  const favoritesData = await favoritesRes.json();
  return favoritesData;
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const { userData, postsData } = await getUserData(params.id);
  const communitiesData = await getUserCommunities(params.id);
  const favoritesData = await getUserFavorites(params.id);

  // ユーザーデータを整形
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
  console.log("userdata", user);

  const posts: Post[] = postsData.results.map((item: any) => ({
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
  }));

  // お気に入り投稿データを整形
  const favorites: Post[] = favoritesData.results.map((item: any) => ({
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
  }));

  const communities: Community[] = communitiesData.results.map((c: any) => ({
    id: c.id,
    name: c.name,
    memberCount: c.memberCount || 0,
    cover_image: c.cover_image || null,
  }));

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
