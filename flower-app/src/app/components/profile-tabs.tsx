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
        {posts.results.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <p className="text-gray-600">投稿がありません。</p>
          </div>
        ) : (
          <PostGrid posts={posts.results} />
        )}
        {/* ページネーションUIをここに追加する場合は posts.next/previous を利用 */}
      </TabsContent>
      <TabsContent value="favorites">
        {favorites.results.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <p className="text-gray-600">お気に入りした投稿がありません。</p>
          </div>
        ) : (
          <PostGrid posts={favorites.results} />
        )}
      </TabsContent>
      <TabsContent value="communities">
        {communities.results.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <p className="text-gray-600">参加しているコミュニティがありません。</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.results.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
