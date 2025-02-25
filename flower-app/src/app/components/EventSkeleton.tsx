// src/app/components/EventSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <Skeleton height={150} />
        </div>
        <div className="md:w-3/4 space-y-4">
          <Skeleton width={200} height={24} />
          <div className="flex items-center space-x-2">
            <Skeleton circle width={20} height={20} />
            <Skeleton width={100} />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton circle width={20} height={20} />
            <Skeleton width={150} />
          </div>
          <Skeleton count={2} />
          <div className="flex justify-between items-center">
            <Skeleton width={100} />
            <Skeleton width={120} height={36} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6 my-8">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
    </div>
  );
}

export function EventPageSkeleton() {
  return (
    <main className="flex-1 container py-8">
      <div className="mb-4">
        <Skeleton width={200} height={20} />
      </div>
      <Skeleton width={300} height={36} className="mb-6" />
      <div className="mb-8">
        <Skeleton height={50} />
      </div>
      
      <Skeleton width={120} height={40} className="mb-6" />
      
      <EventListSkeleton count={3} />
      
      <div className="flex items-center justify-center mt-8 space-x-4">
        <Skeleton width={80} height={36} />
        <Skeleton width={100} height={24} />
        <Skeleton width={80} height={36} />
      </div>
    </main>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <Skeleton height={24} width="80%" className="mb-4" />
            <div className="space-y-2">
              <div className="flex items-center">
                <Skeleton circle width={16} height={16} className="mr-2" />
                <Skeleton width="60%" />
              </div>
              <div className="flex items-center">
                <Skeleton circle width={16} height={16} className="mr-2" />
                <Skeleton width="70%" />
              </div>
              <div className="flex items-center">
                <Skeleton circle width={16} height={16} className="mr-2" />
                <Skeleton width="40%" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton height={36} />
            </div>
          </div>
        ))}
    </div>
  );
}
