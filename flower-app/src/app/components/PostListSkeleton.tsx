// src/app/components/PostListSkeleton.tsx
import { PostCardSkeleton } from './PostCardSkeleton';

interface PostListSkeletonProps {
  count?: number;
}

export function PostListSkeleton({ count = 5 }: PostListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      
      {/* ページネーションUI */}
      <div className="flex space-x-4 mt-4">
        <div className="px-4 py-2 bg-gray-200 opacity-50">前へ</div>
        <div className="px-4 py-2 bg-gray-200 opacity-50">次へ</div>
      </div>
    </div>
  );
}
