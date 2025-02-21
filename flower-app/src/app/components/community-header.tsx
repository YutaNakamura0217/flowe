import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

interface CommunityHeaderProps {
  community: {
    id: number;
    name: string;
    cover_image: string;
    description: string;
    members_count: number;
    is_member: boolean;
  };
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const [isJoining, setIsJoining] = useState(false); // State to track joining/leaving
  const csrfToken = useCsrfToken();

  const handleJoinLeave = async () => {
    setIsJoining(true);
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/communities/${community.id}/join/`,
        {
          method: community.is_member ? "DELETE" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Optimistically update the is_member property
      community.is_member = !community.is_member;
      // Optimistically update the members_count
      community.members_count += community.is_member ? 1 : -1;

    } catch (error) {
      console.error("Error joining/leaving community:", error);
    } finally {
      setIsJoining(false);
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
              {community.members_count} メンバー
            </p>
          </div>
          <Button
            variant="default"
            className="mt-4 sm:mt-0"
            onClick={handleJoinLeave}
            disabled={isJoining}
          >
            {isJoining ? (
              <>{community.is_member ? "退会処理中..." : "参加処理中..."}</>
            ) : (
              <>{community.is_member ? "退会する" : "参加する"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
