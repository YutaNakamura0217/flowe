import { PostCard } from "@/components/post-card"

interface PostListProps {
  posts: any[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

