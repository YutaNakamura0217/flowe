// src/components/PostDetailSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* 画像部分 */}
      <div className="relative aspect-square w-full">
        <Skeleton height="100%" />
      </div>

      {/* ユーザー情報 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton circle width={40} height={40} />
          <div>
            <Skeleton width={100} height={20} />
            <Skeleton width={60} height={15} />
          </div>
        </div>
        <Skeleton width={80} height={30} />
      </div>

      {/* キャプションとタグ */}
      <div className="space-y-2">
        <Skeleton count={2} />
      </div>

      {/* アイコンボタン */}
      <div className="flex items-center space-x-4">
        <Skeleton circle width={32} height={32} />
        <Skeleton circle width={32} height={32} />
        <Skeleton circle width={32} height={32} />
      </div>

      {/* いいね数表示 */}
      <div>
        <Skeleton width={80} height={20} />
      </div>
    </div>
  );
}
