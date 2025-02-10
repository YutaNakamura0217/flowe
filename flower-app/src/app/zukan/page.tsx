"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { FlowerTabs } from "@/components/flower-tabs"
import { FlowerCard } from "@/components/flower-card"
import { FlowerDetails } from "@/components/flower-details"

// 仮のデータ
const flowers = [
  {
    id: "1",
    name: "サクラ",
    scientificName: "Prunus × yedoensis",
    family: "バラ科",
    origin: "日本",
    description: "日本を代表する花木で、春に美しい花を咲かせます。",
    imageUrl: "/placeholder.svg?text=サクラ",
    userPhotos: [
      "/placeholder.svg?text=ユーザー写真1",
      "/placeholder.svg?text=ユーザー写真2",
      "/placeholder.svg?text=ユーザー写真3",
    ],
  },
  {
    id: "2",
    name: "チューリップ",
    scientificName: "Tulipa",
    family: "ユリ科",
    origin: "中央アジア",
    description: "春を代表する球根植物で、多様な色彩の花を咲かせます。",
    imageUrl: "/placeholder.svg?text=チューリップ",
    userPhotos: [
      "/placeholder.svg?text=ユーザー写真1",
      "/placeholder.svg?text=ユーザー写真2",
      "/placeholder.svg?text=ユーザー写真3",
    ],
  },
  // 他の花のデータ...
]

export default function FlowerEncyclopediaPage() {
  const [activeTab, setActiveTab] = useState("aiueo")
  const [selectedFlower, setSelectedFlower] = useState<(typeof flowers)[0] | null>(null)

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "お花図鑑", href: "/zukan" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-6">お花図鑑</h1>
        <FlowerTabs activeTab={activeTab} onTabChange={setActiveTab}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {flowers.map((flower) => (
              <div key={flower.id}>
                <FlowerCard
                  name={flower.name}
                  scientificName={flower.scientificName}
                  family={flower.family}
                  imageUrl={flower.imageUrl}
                  onClick={() => setSelectedFlower(flower)}
                />
                <div className="mt-2">
                  <FlowerDetails {...flower} />
                </div>
              </div>
            ))}
          </div>
        </FlowerTabs>
      </main>
    </div>
  )
}

