import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { CommunitySearchBar } from "@/components/community-search-bar"
import { CommunityCard } from "@/components/community-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

// 仮のデータ
const communities = [
  {
    id: "1",
    name: "バラ愛好会",
    description: "バラの栽培や品種について情報交換するコミュニティです。",
    memberCount: 1000,
    imageUrl: "/placeholder.svg?text=バラ愛好会",
  },
  {
    id: "2",
    name: "多肉植物の世界",
    description: "多肉植物の育て方や珍しい品種の情報を共有します。",
    memberCount: 750,
    imageUrl: "/placeholder.svg?text=多肉植物の世界",
  },
  {
    id: "3",
    name: "ガーデニング初心者の会",
    description: "ガーデニングを始めたばかりの方々のための情報交換の場です。",
    memberCount: 1200,
    imageUrl: "/placeholder.svg?text=ガーデニング初心者の会",
  },
  {
    id: "4",
    name: "日本の野草を守る会",
    description: "日本固有の野草の保護と普及活動を行うコミュニティです。",
    memberCount: 500,
    imageUrl: "/placeholder.svg?text=日本の野草を守る会",
  },
  {
    id: "5",
    name: "ハーブ研究会",
    description: "様々なハーブの栽培方法や利用法について情報交換します。",
    memberCount: 800,
    imageUrl: "/placeholder.svg?text=ハーブ研究会",
  },
  {
    id: "6",
    name: "花のある暮らし",
    description: "日常に花を取り入れる方法やアイデアを共有するコミュニティです。",
    memberCount: 1500,
    imageUrl: "/placeholder.svg?text=花のある暮らし",
  },
]

export default function CommunityListPage() {
  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "コミュニティ", href: "/communities" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-6">コミュニティ一覧</h1>
        <div className="mb-8">
          <CommunitySearchBar />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard key={community.id} {...community} />
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
    </div>
  )
}

