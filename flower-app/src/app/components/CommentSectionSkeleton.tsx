// src/components/CommentSectionSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function CommentSectionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton width={150} height={30} />
      {/* コメントリスト */}
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton circle width={32} height={32} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="60%" height={15} />
            </div>
          ))}
      </div>
      {/* コメントフォーム */}
      <Skeleton width="100%" height={40} />
    </div>
  );
}
