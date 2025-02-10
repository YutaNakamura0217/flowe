"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchResults } from "@/components/search-results"

interface SearchTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  posts: any[]
  users: any[]
  communities: any[]
}

export function SearchTabs({ activeTab, onTabChange, posts, users, communities }: SearchTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">投稿</TabsTrigger>
        <TabsTrigger value="users">ユーザー</TabsTrigger>
        <TabsTrigger value="communities">コミュニティ</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <SearchResults type="posts" items={posts} />
      </TabsContent>
      <TabsContent value="users">
        <SearchResults type="users" items={users} />
      </TabsContent>
      <TabsContent value="communities">
        <SearchResults type="communities" items={communities} />
      </TabsContent>
    </Tabs>
  )
}

