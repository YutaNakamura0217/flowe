// src/app/components/CommunityCardSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface CommunityCardSkeletonProps {
  count?: number;
}

export function CommunityCardSkeleton({ count = 1 }: CommunityCardSkeletonProps) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-40">
              <Skeleton height="100%" />
            </div>
            <CardHeader className="pb-2">
              <Skeleton width={150} height={24} />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton width={100} height={16} />
              <Skeleton count={2} />
            </CardContent>
            <CardFooter className="pt-2">
              <Skeleton width={120} height={36} />
            </CardFooter>
          </Card>
        ))}
    </>
  );
}

export function CommunityGridSkeleton({ count = 6 }: CommunityCardSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CommunityCardSkeleton count={count} />
    </div>
  );
}
