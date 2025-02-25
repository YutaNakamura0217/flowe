"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useJoinLeaveCommunity } from "@/hooks/useJoinLeaveCommunity";

interface CommunityHeaderProps {
  community: {
    id: number;
    name: string;
    cover_image: string;
    description: string;
    members_count: number;
    is_member: boolean;
  };
  onJoinLeave: () => void;
}

export function CommunityHeader({ community, onJoinLeave }: CommunityHeaderProps) {
  const { isJoining, isMember, membersCount, handleJoinLeave } = useJoinLeaveCommunity({
    communityId: community.id,
    initialIsMember: community.is_member,
    initialMembersCount: community.members_count,
  });

  const handleButtonClick = async () => {
    try {
      await handleJoinLeave();
      onJoinLeave(); // コールバックを実行
    } catch (error) {
      // エラーはフック内でログ出力済み
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-40 sm:h-60 md:h-80">
        <Image
          src={community.cover_image || "/placeholder.svg"}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{community.name}</h1>
            <p className="text-muted-foreground">{community.description}</p>
            <p className="text-sm text-muted-foreground">
              {membersCount} メンバー
            </p>
          </div>
          <Button
            variant="default"
            className="mt-4 sm:mt-0"
            onClick={handleButtonClick}
            disabled={isJoining}
          >
            {isJoining ? (
              <>{isMember ? "退会処理中..." : "参加処理中..."}</>
            ) : (
              <>{isMember ? "退会する" : "参加する"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
