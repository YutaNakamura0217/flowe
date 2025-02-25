// app/posts/[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useCsrfToken } from "@/hooks/useCsrfToken";

import { PostDetail } from "@/components/post-detail";
import { CommentSection } from "@/components/comment-section";

import { PostDetailSkeleton } from "@/components/PostDetailSkeleton";
import { CommentSectionSkeleton } from "@/components/CommentSectionSkeleton";

// APIレスポンス型 (必要に応じて修正してください)
interface PostAPIResponse {
  id: number;
  user: {
    id: number;
    username: string;
    display_name: string | null;
    profile_image: string | null;
  };
  image_url: string | null;
  caption: string;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  variety_name: string;
  location: string;
  public_status: string;
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

/**
 * PostPage: ポスト詳細ページ
 */
export default function PostPage({ params }: { params: { id: string } }) {
  // Next.js 13 のルーティングパラメータ
  const { id: postId } = params;

  // ログイン認証フック
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ルータ
  const router = useRouter();

  // CSRF トークン (クライアントサイドで Django にアクセスしてクッキーをセット)
  const csrfToken = useCsrfToken();

  // ポスト & コメント データをステートで管理
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // 現在ログイン中のユーザ情報
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 1) 未ログイン時に /login へリダイレクト
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // 2) ページマウント時にデータを取得
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchAllData();
    }
  }, [authLoading, isAuthenticated]);

  // すべてのデータを一括で取得
  async function fetchAllData() {
    try {
      setLoading(true);

      // ユーザ情報取得
      const userRes = await fetch("https://127.0.0.1:8000/api/accounts/mypage/", {
        method: "GET",
        credentials: "include", // Cookieを送る
        cache: "no-cache",
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUserId(userData.id);
      }

      // 投稿データ取得
      const postRes = await fetch(
        `https://127.0.0.1:8000/api/posts/${postId}/`,
        {
          cache: "no-cache",
          credentials: "include",
        }
      );
      if (!postRes.ok) {
        throw new Error("Failed to fetch post data");
      }
      const postData: PostAPIResponse = await postRes.json();
      setPost({
        id: postData.id.toString(),
        imageUrl: postData.image_url || "/placeholder.svg",
        caption: postData.caption,
        likes: postData.likes,
        comments: postData.comments,
        flowerType: postData.variety_name,
        location: postData.location,
        user: {
          id: postData.user.id,
          name: postData.user.display_name || postData.user.username,
          profile_image: postData.user.profile_image || "/placeholder.svg?user",
        },
        createdAt: postData.created_at,
        tags: postData.tags,
      });

      // コメントデータ取得
      const commentsRes = await fetch(
        `https://127.0.0.1:8000/api/posts/${postId}/comments/`,
        { cache: "no-cache", credentials: "include" }
      );
      if (commentsRes.ok) {
        const commentsData: CommentAPIResponse[] = await commentsRes.json();
        const mappedComments: Comment[] = commentsData.map((c) => ({
          id: c.id.toString(),
          user: {
            name: c.user.display_name || c.user.username,
            profile_image: c.user.profile_image || "/placeholder.svg?user",
          },
          text: c.text,
          createdAt: c.created_at,
          likes: c.likes,
        }));
        setComments(mappedComments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 認証状態が確定していない場合はそのままローディング表示
  if (authLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {loading ? (
            <>
              <PostDetailSkeleton />
              <CommentSectionSkeleton />
            </>
          ) : (
            <>
              {post && (
                <PostDetail
                  post={post}
                  currentUserId={currentUserId ?? undefined}
                  csrfToken={csrfToken}
                />
              )}
              <CommentSection
                resourceType="post"
                resourceId={postId}
                initialComments={comments}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
