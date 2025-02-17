import { useState, useCallback, useEffect } from "react"

export interface Community {
  id: number
  name: string
  description: string
  cover_image: string
  members_count: number
}

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([])

  const fetchCommunities = useCallback(async () => {
    try {
      const response = await fetch("https://127.0.0.1:8000/api/communities/")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCommunities(data)
    } catch (error) {
      console.error("Error fetching communities:", error)
    }
  }, [])

  // カスタムフック内で自動的にデータを取得するなら useEffect をここで呼ぶ
  useEffect(() => {
    fetchCommunities()
  }, [fetchCommunities])

  // 必要があれば refresh 的なメソッドで呼び出し側が再取得できるようにする
  return { communities, fetchCommunities }
}
