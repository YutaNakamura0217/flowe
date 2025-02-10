"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { SearchTabs } from "@/components/search-tabs"
import { SearchFilters } from "@/components/search-filters"
import { FloatingActionButton } from "@/components/floating-action-button"
import Image from "next/image"


// 仮のデータ取得関数 (Promiseを返すように修正)
const fetchSearchResults = async (query: string, filters: Record<string, string[]>): Promise<any> => {
  console.log("Fetching results for:", query, "with filters:", filters)
  // ★ 重要:  ダミーデータを返す前に少し待機時間を設ける（Suspenseの動作確認のため）
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    posts: Array.from({ length: 6 }, (_, i) => ({
      id: `post-${i}`,
      caption: `${query}に関する美しい花の写真 ${i + 1}`,
      imageUrl: `/placeholder.svg?text=Post${i + 1}&w=300&h=200`, // サイズ指定
    })),
    users: Array.from({ length: 6 }, (_, i) => ({
      id: `user-${i}`,
      name: `${query}好きなユーザー${i + 1}`,
      avatar: `/placeholder.svg?text=User${i + 1}&w=50&h=50`, // サイズ指定
      bio: `${query}が大好きです。特に${filters.flowerTypes?.[0] || "花"}が好きです。`,
    })),
    communities: Array.from({ length: 6 }, (_, i) => ({
      id: `community-${i}`,
      name: `${query}愛好会 ${i + 1}`,
      description: `${query}について語り合うコミュニティです。`,
      membersCount: 100 * (i + 1),
    })),
  }
}

// ローディングコンポーネント
const SearchResultsLoading = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-md"></div>
      ))}
    </div>
  </div>
);


// SearchResults コンポーネント (データ表示部分を分離)
const SearchResults = ({ activeTab, searchResults }: { activeTab: string, searchResults: any }) => {

    if (activeTab === "posts") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.posts.map((post: any) => (
                    <div key={post.id} className="border rounded-lg p-4">
                        <Image
                            src={post.imageUrl}
                            alt={post.caption}
                            width={300}
                            height={200}
                            className="w-full h-auto rounded-md"
                        />
                        <p className="mt-2 text-sm">{post.caption}</p>
                    </div>
                ))}
            </div>
        );
    }

    if (activeTab === "users") {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.users.map((user: any) => (
              <div key={user.id} className="flex items-center border rounded-lg p-4">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.bio}</p>
                </div>
              </div>
            ))}
          </div>
        );
    }

    if(activeTab === "communities") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.communities.map((community: any) => (
            <div key={community.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold">{community.name}</h3>
              <p className="text-sm text-gray-500">{community.description}</p>
              <p className="text-sm text-gray-500 mt-2">メンバー数: {community.membersCount}</p>
            </div>
          ))}
        </div>
      );
    }

    return <div>No results found for {activeTab}</div>
}




function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [activeTab, setActiveTab] = useState("posts")
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchResults, setSearchResults] = useState<any>({
    posts: [],
    users: [],
    communities: [],
  })

  useEffect(() => {
    const fetchResults = async () => {
      const results = await fetchSearchResults(query, filters)
      setSearchResults(results)
    }
    fetchResults()
  }, [query, filters])

  const handleApplyFilters = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters)
  }

  return (
    <>
      <div className="mb-8">
        <SearchBar initialQuery={query} />
      </div>
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-3">
          <SearchTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            posts={searchResults.posts} // Dummy data, only for counts
            users={searchResults.users}  // Dummy data, only for counts
            communities={searchResults.communities} // Dummy data, only for counts
          />
          {/* データ表示部分 */}
          <Suspense fallback={<SearchResultsLoading />}>
              <SearchResults activeTab={activeTab} searchResults={searchResults} />
          </Suspense>
        </div>
        <div className="mt-8 lg:mt-0">
          <SearchFilters onApplyFilters={handleApplyFilters} />
        </div>
      </div>
    </>
  )
}



export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
          <Suspense fallback={<SearchResultsLoading/>}>
            <SearchPageContent />
          </Suspense>
      </main>
      <FloatingActionButton />
    </div>
  )
}