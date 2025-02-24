import { PostCard } from "./post-card"
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { Post } from "@/hooks/usePosts";

interface PaginatedPosts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

interface PostListProps {
  postData: PaginatedPosts;
}

export function PostList({ postData }: PostListProps) {
  const csrfToken = useCsrfToken();
  // 実際に配列として描画したい部分は postData.results
  return (
    <div>
      {postData.results.map((post) => (
        <PostCard key={post.id} post={post} csrfToken={csrfToken} />
      ))}

      {/* ページ情報などを表示したい場合 */}
      <div>全 {postData.count} 件</div>
    </div>
  )
}
