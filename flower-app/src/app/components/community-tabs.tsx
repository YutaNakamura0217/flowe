"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostGrid } from "@/components/post-grid"
import { EventGrid } from "@/components/event-grid"
import { PaginatedPosts } from "@/hooks/usePosts"

interface CommunityTabsProps {
  posts: PaginatedPosts;
  events: any[];
  isLoading?: boolean;
}

export function CommunityTabs({ posts, events, isLoading = false }: CommunityTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="events">イベント</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <PostGrid posts={posts.results} />
      </TabsContent>

      <TabsContent value="events">
        <EventGrid events={events} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  )
}
