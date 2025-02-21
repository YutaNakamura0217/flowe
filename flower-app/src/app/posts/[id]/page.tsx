// app/posts/[id]/page.tsx
import { PostDetail } from "@/components/post-detail";
import { CommentSection } from "@/components/comment-section";

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

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const postId = params.id;

  // 投稿データの取得
  const postRes = await fetch(`https://127.0.0.1:8000/api/posts/${postId}/`, { cache: "no-cache" });
  if (!postRes.ok) {
    throw new Error("Failed to fetch post data");
  }
  const postData: PostAPIResponse = await postRes.json();

  // Fetch the current user's data.  This assumes there's an API endpoint
  // at /api/accounts/mypage/ that returns the logged-in user's information.
  // The credentials: "include" option is necessary to send cookies with the
  // request, which is essential for authentication.
    const userRes = await fetch(`https://127.0.0.1:8000/api/accounts/mypage/`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache"
    });

    let currentUserData = null;
    if (userRes.ok) {
        currentUserData = await userRes.json();
    }


  const post = {
    id: postData.id.toString(),
    imageUrl: postData.image_url || "/placeholder.svg",
    caption: postData.caption,
    likes: postData.likes,
    comments: postData.comments,
    flowerType: postData.variety_name,
    location: postData.location,
    user: {
      id: postData.user.id.toString(),
      name: postData.user.display_name || postData.user.username,
      profile_image: postData.user.profile_image || "/placeholder.svg?user",
    },
    createdAt: postData.created_at,
    tags: postData.tags,
  };

  // 初期コメントデータの取得
    const commentsRes = await fetch(`https://127.0.0.1:8000/api/posts/${postId}/comments/`, { cache: "no-cache" });
  let initialComments: Comment[] = [];
  if (commentsRes.ok) {
    const commentsData: CommentAPIResponse[] = await commentsRes.json();
    initialComments = commentsData.map((c) => ({
      id: c.id.toString(),
      user: {
        name: c.user.display_name || c.user.username,
        profile_image: c.user.profile_image || "/placeholder.svg?user",
      },
      text: c.text,
      createdAt: c.created_at,
      likes: c.likes,
    }));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <PostDetail post={post} currentUserId={currentUserData?.id} />
          <CommentSection postId={postId} initialComments={initialComments} />
        </div>
      </main>
    </div>
  );
}
