// src/app/components/UserDropdownSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Button } from "@/components/ui/button";

export function UserDropdownSkeleton() {
  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Skeleton circle width={32} height={32} />
    </Button>
  );
}
