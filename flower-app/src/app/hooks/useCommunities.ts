import { useState, useCallback, useEffect } from "react"

export interface Community {
  id: number
  name: string
  description: string
  cover_image: string
  members_count: number
  is_member: boolean
}

interface PaginatedCommunities {
  count: number
  next: string | null
  previous: string | null
  results: Community[]
}

export function useCommunities() {
  // ページネーションも含めたオブジェクトとして管理
  const [data, setData] = useState<PaginatedCommunities>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const fetchCommunities = useCallback(async (page: number = 1) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/communities/?page=${page}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedData = await response.json() as PaginatedCommunities;
      // そのまま setData に格納
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  }, []);

  useEffect(() => {
    // 初回ロード時に1ページ目を取得
    fetchCommunities(1);
  }, [fetchCommunities]);

  // 呼び出し元では data.results.map(...) というようにしてリストを表示できる
  return {
    communities: data.results,
    count: data.count,
    next: data.next,
    previous: data.previous,
    fetchCommunities,
  };
}
