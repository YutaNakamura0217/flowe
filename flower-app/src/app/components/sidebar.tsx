import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { useState } from "react";

interface Community {
  id: number;
  name: string;
  description: string;
  cover_image: string;
  members_count: number;
  is_member: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  attendees: number;
  //... 他の必要なフィールド
}

interface SidebarProps {
  communities: Community[];
  events: Event[];
}

export const Sidebar: React.FC<SidebarProps> = ({ communities, events }) => {
  const [joiningStatus, setJoiningStatus] = useState<{ [key: number]: boolean }>(
    {}
  );
  const csrfToken = useCsrfToken();

  const handleJoinLeave = async (community: Community) => {
    setJoiningStatus((prev) => ({
      ...prev,
      [community.id]: true,
    }));

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

      // Optimistically update the is_member property and refetch data if needed
      const updatedCommunities = communities.map((c) =>
        c.id === community.id ? { ...c, is_member: !c.is_member } : c
      );
      // Assuming there's a way to update the communities list in the parent component
      // updateCommunities(updatedCommunities); // This function needs to be passed as a prop

    } catch (error) {
      console.error("Error joining/leaving community:", error);
    } finally {
      setJoiningStatus((prev) => ({
        ...prev,
        [community.id]: false,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">おすすめコミュニティ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {communities.map((community) => (
            <div key={community.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={community.cover_image} alt={community.name} />
                  <AvatarFallback>{community.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium leading-none">
                    {community.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    メンバー: {community.members_count}人
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleJoinLeave(community)}
                disabled={joiningStatus[community.id]}
              >
                {joiningStatus[community.id] ? (
                  <>{community.is_member ? "退会処理中..." : "参加処理中..."}</>
                ) : (
                  <>{community.is_member ? "退会する" : "参加する"}</>
                )}
              </Button>
            </div>
          ))}
          <Link href="/communities" className="text-sm text-muted-foreground hover:underline block text-center">
            すべて見る
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">近日開催のイベント</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="space-y-2">
              <h3 className="text-sm font-medium">{event.title}</h3>
              <p className="text-xs text-muted-foreground">{event.date}</p>
              <p className="text-xs text-muted-foreground">
                参加予定: {event.attendees}人
              </p>
            </div>
          ))}
          <Link href="/events" className="text-sm text-muted-foreground hover:underline block text-center">
            すべて見る
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
