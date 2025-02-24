"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostList } from "@/components/post-list"
import { EventList } from "@/components/event-list"
import { Post } from "@/hooks/usePosts";

interface CommunityTabsProps {
  posts: Post[];
  events: any[];
}

export function CommunityTabs({ posts, events }: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="events">イベント</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostList postData={{ results: posts, count: posts.length, next: null, previous: null }} />
      </TabsContent>
      <TabsContent value="events">
        <EventList events={events} />
      </TabsContent>
    </Tabs>
  )
}
