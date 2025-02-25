// src/app/components/PostGridSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface PostGridSkeletonProps {
  count?: number;
}

export function PostGridSkeleton({ count = 9 }: PostGridSkeletonProps) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="relative aspect-square">
            <Skeleton height="100%" />
          </div>
        ))}
    </div>
  );
}
