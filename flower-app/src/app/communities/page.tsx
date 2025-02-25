"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { CommunitySearchBar } from "@/components/community-search-bar";
import { CommunityCard } from "@/components/community-card";
import { CommunityGridSkeleton } from "@/components/CommunityCardSkeleton";
import { CommunitySerializer } from "@/components/types";
import { PaginationControls } from "@/components/PaginationControls";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function CommunityListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  const searchQuery = searchParams?.get('q') || '';
  
  const [communities, setCommunities] = useState<CommunitySerializer[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "コミュニティ", href: "/communities" },
  ];

  useEffect(() => {
    async function fetchCommunities() {
      setLoading(true);
      try {
        // 検索クエリがある場合はURLに追加
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        if (searchQuery) {
          queryParams.append('q', searchQuery);
        }
        
        const res = await fetch(`https://127.0.0.1:8000/api/communities/?${queryParams.toString()}`, {
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch communities: ${res.status}`);
        }
        
        const data = await res.json() as PaginatedResponse<CommunitySerializer>;
        setCommunities(data.results);
        setCount(data.count);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "コミュニティの取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchCommunities();
  }, [page, searchQuery]); // 検索クエリが変更されたときも再取得

  const totalPages = Math.ceil(count / 10); // Assuming 10 items per page

  return (
    <main className="flex-1 container py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">コミュニティ一覧</h1>
      <div className="mb-8">
        <CommunitySearchBar />
      </div>
      
      {searchQuery && (
        <div className="mb-4 p-2 bg-blue-50 rounded-md">
          <p className="text-blue-700">
            「{searchQuery}」の検索結果: {count} 件
          </p>
        </div>
      )}
      
      {loading ? (
        <CommunityGridSkeleton count={6} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : communities.length === 0 ? (
        <div className="text-center py-8">
          {searchQuery ? (
            <p className="text-gray-500">「{searchQuery}」に一致するコミュニティが見つかりませんでした。</p>
          ) : (
            <p className="text-gray-500">コミュニティが見つかりませんでした。</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <PaginationControls 
          totalPages={totalPages} 
          currentPage={page} 
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
}
