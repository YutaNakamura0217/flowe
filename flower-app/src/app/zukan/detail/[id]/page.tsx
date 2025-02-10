import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FlowerPhotoCarousel } from "@/components/flower-photo-carousel"
import { FlowerInfo } from "@/components/flower-info"
import { RelatedPosts } from "@/components/related-posts"

// 仮のデータ
const flowerDetail = {
  id: "1",
  name: "サクラ",
  scientificName: "Prunus × yedoensis",
  family: "バラ科",
  origin: "日本",
  characteristics: "春に美しいピンク色の花を咲かせる日本を代表する花木です。花びらは5枚で、多くの品種があります。",
  careInstructions:
    "日当たりの良い場所を好みます。水はけの良い土壌で育てましょう。剪定は花が咲き終わった後に行います。",
  photos: ["/placeholder.svg?text=サクラ1", "/placeholder.svg?text=サクラ2", "/placeholder.svg?text=サクラ3"],
}

const relatedPosts = [
  {
    id: "post1",
    title: "サクラの美しい並木道",
    imageUrl: "/placeholder.svg?text=サクラ並木",
    author: "花子",
  },
  {
    id: "post2",
    title: "夜桜ライトアップイベント",
    imageUrl: "/placeholder.svg?text=夜桜",
    author: "太郎",
  },
  {
    id: "post3",
    title: "サクラの育て方のコツ",
    imageUrl: "/placeholder.svg?text=サクラの育て方",
    author: "緑子",
  },
  {
    id: "post4",
    title: "サクラの品種図鑑",
    imageUrl: "/placeholder.svg?text=サクラの品種",
    author: "学者",
  },
]

export default function FlowerDetailPage({ params }: { params: { id: string } }) {
  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "お花図鑑", href: "/zukan" },
    { label: flowerDetail.name, href: `/zukan/detail/${params.id}` },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-screen-lg mx-auto p-4">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold mb-6">{flowerDetail.name}</h1>
          <div className="grid gap-8 md:grid-cols-2">
            <FlowerPhotoCarousel photos={flowerDetail.photos} flowerName={flowerDetail.name} />
            <FlowerInfo
              name={flowerDetail.name}
              scientificName={flowerDetail.scientificName}
              family={flowerDetail.family}
              origin={flowerDetail.origin}
              characteristics={flowerDetail.characteristics}
              careInstructions={flowerDetail.careInstructions}
            />
          </div>
          <div className="mt-12">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </div>
      </main>
    </div>
  )
}

