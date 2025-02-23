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
  attendees: [];
}

interface SidebarProps {
  communities: Community[];
  events: Event[];
}

export const Sidebar: React.FC<SidebarProps> = ({ communities, events }) => {
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
                            <Link href={`/communities/${community.id}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    詳細を見る
                                </Button>
                            </Link>
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
                                参加予定: {event.attendees.length}人
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
