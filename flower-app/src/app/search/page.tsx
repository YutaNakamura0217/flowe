"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { SearchTabs } from "@/components/search-tabs"
import { SearchFilters } from "@/components/search-filters"
import { FloatingActionButton } from "@/components/floating-action-button"

// 仮のデータ取得関数
const fetchSearchResults = async (query: string, filters: Record<string, string[]>) => {
  // 実際のAPIコールをここに実装します
  console.log("Fetching results for:", query, "with filters:", filters)

  // 仮のデータを返します
  return {
    posts: Array.from({ length: 6 }, (_, i) => ({
      id: `post-${i}`,
      caption: `${query}に関する美しい花の写真 ${i + 1}`,
      imageUrl: `/placeholder.svg?text=Post${i + 1}`,
    })),
    users: Array.from({ length: 6 }, (_, i) => ({
      id: `user-${i}`,
      name: `${query}好きなユーザー${i + 1}`,
      avatar: `/placeholder.svg?text=User${i + 1}`,
      bio: `${query}が大好きです。特に${filters.flowerTypes[0] || "花"}が好きです。`,
    })),
    communities: Array.from({ length: 6 }, (_, i) => ({
      id: `community-${i}`,
      name: `${query}愛好会 ${i + 1}`,
      description: `${query}について語り合うコミュニティです。`,
      membersCount: 100 * (i + 1),
    })),
  }
}

export default function SearchPage() {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <SearchBar initialQuery={query} />
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <SearchTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              posts={searchResults.posts}
              users={searchResults.users}
              communities={searchResults.communities}
            />
          </div>
          <div className="mt-8 lg:mt-0">
            <SearchFilters onApplyFilters={handleApplyFilters} />
          </div>
        </div>
      </main>
      <FloatingActionButton />
    </div>
  )
}

