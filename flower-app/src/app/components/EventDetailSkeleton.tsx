// src/app/components/EventDetailSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CommentSectionSkeleton } from './CommentSectionSkeleton';

export function EventDetailsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <Skeleton width={300} height={32} />
        
        <div className="flex items-center space-x-2">
          <Skeleton circle width={40} height={40} />
          <Skeleton width={150} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton width={100} height={16} />
            <Skeleton width={150} height={20} />
          </div>
          <div>
            <Skeleton width={100} height={16} />
            <Skeleton width={150} height={20} />
          </div>
          <div>
            <Skeleton width={100} height={16} />
            <Skeleton width={150} height={20} />
          </div>
          <div>
            <Skeleton width={100} height={16} />
            <Skeleton width={150} height={20} />
          </div>
        </div>
        
        <div>
          <Skeleton width={100} height={16} />
          <Skeleton count={3} />
        </div>
        
        <div className="flex justify-end">
          <Skeleton width={120} height={40} />
        </div>
      </div>
    </div>
  );
}

export function GoogleMapSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Skeleton height={300} />
    </div>
  );
}

export function ParticipantListSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Skeleton width={200} height={24} className="mb-4" />
      
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={120} />
            </div>
          ))}
      </div>
    </div>
  );
}

export function EventDetailPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <EventDetailsSkeleton />
            <GoogleMapSkeleton />
            <CommentSectionSkeleton />
          </div>
          
          <div className="space-y-8">
            <ParticipantListSkeleton />
            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
