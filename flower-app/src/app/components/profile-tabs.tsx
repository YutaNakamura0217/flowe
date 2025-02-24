"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostGrid } from "@/components/post-grid";
import { CommunityCard } from "@/components/community-card";
import { PaginatedPosts, PaginatedCommunities } from "@/components/types";

interface ProfileTabsProps {
  posts: PaginatedPosts;
  favorites: PaginatedPosts;
  communities: PaginatedCommunities;
}

export function ProfileTabs({ posts, favorites, communities }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");
  return (
    <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="favorites">お気に入り</TabsTrigger>
        <TabsTrigger value="communities">参加コミュニティ</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <PostGrid posts={posts.results} />
        {/* ページネーションUIをここに追加する場合は posts.next/previous を利用 */}
      </TabsContent>
      <TabsContent value="favorites">
        <PostGrid posts={favorites.results} />
      </TabsContent>
      <TabsContent value="communities">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.results.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
