// app/communities/page.tsx
import { Breadcrumb } from "@/components/breadcrumb";
import { CommunitySearchBar } from "@/components/community-search-bar";
import { CommunityCard } from "@/components/community-card";
import { cookies } from 'next/headers';
import { CommunitySerializer } from "@/components/types";
import { PaginationControls } from "@/components/PaginationControls";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function getCommunities(page: number = 1) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('sessionid')?.value;

  const headers = new Headers();
  if (sessionCookie) {
    headers.append('Cookie', `sessionid=${sessionCookie}`);
  }

  const res = await fetch(`https://127.0.0.1:8000/api/communities/?page=${page}`, {
    cache: "no-store",
    headers: headers,
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch communities: ${res.status}`);
  }
  return res.json() as Promise<PaginatedResponse<CommunitySerializer>>;
}

export default async function CommunityListPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "コミュニティ", href: "/communities" },
  ];

  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const { results: communities, count } = await getCommunities(page);
  const totalPages = Math.ceil(count / 10); // Assuming 10 items per page

  return (
    <main className="flex-1 container py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">コミュニティ一覧</h1>
      <div className="mb-8">
        <CommunitySearchBar />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationControls totalPages={totalPages} currentPage={page} />
      </div>
    </main>
  );
}
