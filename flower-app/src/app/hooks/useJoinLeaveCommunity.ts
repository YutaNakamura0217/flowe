"use client";

import { useState, useCallback } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

interface UseJoinLeaveCommunityProps {
  communityId: number;
  initialIsMember: boolean;
  initialMembersCount: number;
}

export function useJoinLeaveCommunity({
  communityId,
  initialIsMember,
  initialMembersCount,
}: UseJoinLeaveCommunityProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(initialIsMember);
  const [membersCount, setMembersCount] = useState(initialMembersCount);
  const csrfToken = useCsrfToken();

  const handleJoinLeave = useCallback(async () => {
    setIsJoining(true);
    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/communities/${communityId}/join/`,
        {
          method: isMember ? "DELETE" : "POST",
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

      // ローカル状態の更新
      setIsMember((prev) => !prev);
      setMembersCount((prev) => (isMember ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error joining/leaving community:", error);
      throw error;
    } finally {
      setIsJoining(false);
    }
  }, [communityId, isMember, csrfToken]);

  return { isJoining, isMember, membersCount, handleJoinLeave };
}
