"use client";
import { ProfileHeader } from "@/components/profile-header";
import { UserStats } from "@/components/user-stats";
import { ProfileTabs } from "@/components/profile-tabs";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { useMyPage } from "@/hooks/useMyPage";
import { FloatingActionButton } from "@/components/floating-action-button";

export default function MyPage() {
  // マイページ情報の取得（独自フック使用）
  const { data, loading, fetchMyPage, currentPage, setCurrentPage } = useMyPage();

  if (loading) {
    return <ProfileSkeleton />;
  }
  if (!data) {
    return <div>データがありません</div>;
  }

  // ユーザーオブジェクトの整形
  const user = {
    id: data.id,
    username: data.display_name || data.username,
    profile: {
      bio: data.bio,
      cover_image: data.cover_image_url || "/placeholder.svg?cover",
      profile_image: data.profile_image_url || "/placeholder-avatar.svg",
    },
    posts_count: data.posts_count,
    followers_count: data.followers_count,
    following_count: data.following_count,
    joinedDate: data.joined_date,
  };

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "マイページ", href: "/mypage" },
  ];

  return (
    <main className="flex-1">
      <ProfileHeader user={user} />
      <div className="container py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="my-8">
          <UserStats
            userId={user.id}
            postsCount={user.posts_count}
            followersCount={user.followers_count}
            followingCount={user.following_count}
            joinedDate={user.joinedDate}
          />
        </div>
        {/* 投稿一覧は useMyPage フックで管理している posts を渡す */}
        <ProfileTabs
          posts={data.posts}
          favorites={data.favorites}
          communities={data.communities}
          userId={data.id}
        />
      </div>

      {/* FAB をクリックするとモーダルを表示 */}
      {/* 新規投稿後に最初のページを再読み込み */}
      <FloatingActionButton onPostCreated={() => setCurrentPage(1)} />
    </main>
  );
}
