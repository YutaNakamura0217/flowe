"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostList } from "@/components/post-list"
import { EventList } from "@/components/event-list"
import { PaginatedPosts } from "@/hooks/usePosts"

interface CommunityTabsProps {
  posts: PaginatedPosts;
  events: any[];
}

export function CommunityTabs({ posts, events }: CommunityTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="events">イベント</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <PostList postData={posts} />
      </TabsContent>

      <TabsContent value="events">
        <EventList events={events} />
      </TabsContent>
    </Tabs>
  )
}
