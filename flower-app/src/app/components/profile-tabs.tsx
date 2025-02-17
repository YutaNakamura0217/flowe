"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostGrid } from "@/components/post-grid"
import { CommunityCard } from "@/components/community-card"

interface ProfileTabsProps {
  posts: any[]
  favorites: any[]
  communities: any[]
}

export function ProfileTabs({ posts, favorites, communities }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts") 
  return (
    <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="favorites">お気に入り</TabsTrigger>
        <TabsTrigger value="communities">参加コミュニティ</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostGrid posts={posts} />
      </TabsContent>
      <TabsContent value="favorites">
        <PostGrid posts={favorites} />
      </TabsContent>
      <TabsContent value="communities">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

