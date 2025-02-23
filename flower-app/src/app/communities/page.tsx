// app/communities/page.tsx
import { Breadcrumb } from "@/components/breadcrumb";
import { CommunitySearchBar } from "@/components/community-search-bar";
import { CommunityCard } from "@/components/community-card";
import { cookies } from 'next/headers';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Community } from "@/components/types";

async function getCommunities() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('sessionid')?.value;

  const headers = new Headers();
  if (sessionCookie) {
    headers.append('Cookie', `sessionid=${sessionCookie}`);
  }

  const res = await fetch("https://127.0.0.1:8000/api/communities/", {
    cache: "no-store",
    headers: headers,
    // credentials: "include",  // Remove credentials: "include"
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch communities: ${res.status}`);
  }
  return res.json() as Promise<Community[]>;
}

export default async function CommunityListPage() {
  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "コミュニティ", href: "/communities" },
  ];

  const communities = await getCommunities();

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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
