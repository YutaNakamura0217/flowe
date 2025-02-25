"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EventSearchBar() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams?.get('q') || ""
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  // 検索パラメータが変更されたときにinputの値を更新
  useEffect(() => {
    setQuery(searchParams?.get('q') || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query)}`)
    } else {
      // 検索クエリが空の場合は、クエリパラメータなしのURLに遷移
      router.push('/events')
    }
  }

  const handleClear = () => {
    setQuery("")
    router.push('/events')
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="イベントを検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">クリア</span>
          </button>
        )}
      </div>
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">検索</span>
      </Button>
    </form>
  )
}
