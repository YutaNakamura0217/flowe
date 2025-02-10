import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"
import { Sidebar } from "@/components/sidebar"
import { FloatingActionButton } from "@/components/floating-action-button"

// 仮のデータ
const posts = Array.from({ length: 6 }, (_, i) => ({
  id: `post-${i}`,
  imageUrl: `/placeholder.svg?${i}`,
  caption: `美しいバラが咲きました！${i}`,
  likes: 100 + i,
  comments: 10 + i,
  user: {
    name: `ユーザー${i}`,
    avatar: `/placeholder.svg?user${i}`,
  },
}))

export default function HomePage() {
  return (
    // 背景色をオフホワイト (#F7F7F7) に変更
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] bg-[url('/assets/floral-background.jpg')] bg-fixed bg-cover">
      <Header />

      {/* ヒーローセクション：アプリ紹介や季節のおすすめ画像 */}
      <section className="relative w-full h-64 mb-8 overflow-hidden">
        <img 
          src="/assets/hero-image.jpg" 
          alt="季節のおすすめ" 
          className="object-cover w-full h-full"
        />
        {/* オーバーレイでテキストの視認性向上 */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl text-white font-bold mb-2">Flower Friendsへようこそ</h1>
          <p className="text-lg text-white">あなたの花の物語をシェアしよう</p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* 左メイン：投稿カード群 */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          {/* 右サイドバー：おすすめコミュニティ、近日開催のイベント */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <FloatingActionButton />
    </div>
  )
}

