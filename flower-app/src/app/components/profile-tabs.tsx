"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostGrid } from "@/components/post-grid"

interface ProfileTabsProps {
  posts: any[]
  favorites: any[]
}

export function ProfileTabs({ posts, favorites }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="favorites">お気に入り</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostGrid posts={posts} />
      </TabsContent>
      <TabsContent value="favorites">
        <PostGrid posts={favorites} />
      </TabsContent>
    </Tabs>
  )
}

