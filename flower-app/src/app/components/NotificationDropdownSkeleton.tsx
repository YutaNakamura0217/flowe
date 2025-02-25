// src/app/components/NotificationDropdownSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Button } from "@/components/ui/button";

export function NotificationDropdownSkeleton() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Skeleton circle width={24} height={24} />
    </Button>
  );
}
