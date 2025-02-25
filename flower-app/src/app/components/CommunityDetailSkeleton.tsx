// src/app/components/CommunityDetailSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PostCardSkeleton } from './PostCardSkeleton';

export function CommunityHeaderSkeleton() {
  return (
    <div className="relative">
      {/* カバー画像 */}
      <div className="h-48 w-full">
        <Skeleton height="100%" />
      </div>
      
      {/* コミュニティ情報 */}
      <div className="container">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 relative z-10">
          {/* コミュニティアイコン */}
          <div className="mb-4 md:mb-0 md:mr-6">
            <Skeleton circle width={120} height={120} />
          </div>
          
          {/* コミュニティ名 */}
          <div className="flex-1 text-center md:text-left">
            <Skeleton width={200} height={24} />
            <Skeleton width={150} height={16} />
          </div>
          
          {/* 参加ボタン */}
          <div className="mt-4 md:mt-0">
            <Skeleton width={100} height={40} />
          </div>
        </div>
        
        {/* メンバー数 */}
        <div className="flex justify-center md:justify-start space-x-8 mt-6">
          <div className="text-center">
            <Skeleton width={100} height={20} />
          </div>
        </div>
        
        {/* 説明 */}
        <div className="mt-6">
          <Skeleton count={2} />
        </div>
      </div>
    </div>
  );
}

export function CommunityTabsSkeleton() {
  return (
    <div className="space-y-6">
      {/* タブ */}
      <div className="flex border-b">
        <div className="px-4 py-2 border-b-2 border-primary">
          <Skeleton width={80} height={24} />
        </div>
        <div className="px-4 py-2">
          <Skeleton width={80} height={24} />
        </div>
      </div>
      
      {/* コンテンツ */}
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

export function CommunityDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <CommunityHeaderSkeleton />
        <div className="container py-8">
          <div className="mb-4 flex gap-2">
            <Skeleton width={100} height={40} />
            <Skeleton width={120} height={40} />
          </div>
          <CommunityTabsSkeleton />
        </div>
      </main>
    </div>
  );
}
