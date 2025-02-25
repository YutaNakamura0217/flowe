// src/app/components/PostCardSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-[#FFF0F5]">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton circle width={48} height={48} />
          <div className="flex-1 min-w-0">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Skeleton height="100%" />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton circle width={20} height={20} />
          <Skeleton circle width={20} height={20} />
          <Skeleton circle width={20} height={20} />
        </div>
        <Skeleton width={80} height={16} />
        <Skeleton count={2} />
        <Skeleton width={150} height={16} />
      </CardFooter>
    </Card>
  );
}
