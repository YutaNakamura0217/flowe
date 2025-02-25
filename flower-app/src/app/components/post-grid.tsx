// components/post-grid.tsx
import Image from "next/image";
import Link from "next/link";
import { PostGridSkeleton } from "./PostGridSkeleton";

interface PostGridProps {
  posts: {
    id: number;
    image_url: string;
    likes: number;
    comments: number;
  }[];
}

export function PostGrid({ posts }: PostGridProps) {
  // データがロード中かどうかを判断
  const isLoading = !posts || posts.length === 0;

  if (isLoading) {
    return <PostGridSkeleton count={9} />;
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="relative aspect-square"
        >
          <Image
            src={post.image_url || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="text-white text-sm flex space-x-2">
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
