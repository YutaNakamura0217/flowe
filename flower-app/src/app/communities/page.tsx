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
        const res = await fetch(`https://127.0.0.1:8000/api/communities/?page=${page}`, {
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
  }, [page]);

  const totalPages = Math.ceil(count / 10); // Assuming 10 items per page

  return (
    <main className="flex-1 container py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">コミュニティ一覧</h1>
      <div className="mb-8">
        <CommunitySearchBar />
      </div>
      
      {loading ? (
        <CommunityGridSkeleton count={6} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <PaginationControls totalPages={totalPages} currentPage={page} />
      </div>
    </main>
  );
}
