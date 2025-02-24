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
  return (
    <div>
      {postData.results.map((post) => (
        <PostCard key={post.id} post={post} csrfToken={csrfToken} />
      ))}
    </div>
  )
}
