"use client";

import { useState } from "react";
import { Flower, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserFollowModal } from "@/components/user-follow-modal";

interface UserStatsProps {
  userId: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
}

export function UserStats({ userId, postsCount, followersCount, followingCount, joinedDate }: UserStatsProps) {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Flower className="h-8 w-8 text-pink-400 mb-2" />
            <p className="text-2xl font-bold">{postsCount}</p>
            <p className="text-sm text-muted-foreground">投稿</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent 
            className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => setShowFollowersModal(true)}
          >
            <Users className="h-8 w-8 text-blue-400 mb-2" />
            <p className="text-2xl font-bold">{followersCount}</p>
            <p className="text-sm text-muted-foreground">フォロワー</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent 
            className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => setShowFollowingModal(true)}
          >
            <Users className="h-8 w-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold">{followingCount}</p>
            <p className="text-sm text-muted-foreground">フォロー中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-8 w-8 text-purple-400 mb-2" />
            <p className="text-sm text-muted-foreground">登録日</p>
            <p className="text-lg font-medium">{joinedDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* フォロワーモーダル */}
      <UserFollowModal
        userId={userId}
        type="followers"
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      />

      {/* フォロー中モーダル */}
      <UserFollowModal
        userId={userId}
        type="following"
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      />
    </>
  );
}
