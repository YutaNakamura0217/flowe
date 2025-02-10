import { Header } from "@/components/header"
import { CommunityHeader } from "@/components/community-header"
import { CommunityTabs } from "@/components/community-tabs"

// 仮のデータ
const community = {
  id: "1",
  name: "バラ愛好会",
  coverImage: "/placeholder.svg?cover",
  description: "バラの栽培や品種について情報交換するコミュニティです。",
  membersCount: 1000,
  isMember: false,
}

const posts = Array.from({ length: 5 }, (_, i) => ({
  id: `post-${i}`,
  imageUrl: `/placeholder.svg?post${i}`,
  caption: `美しいバラが咲きました！${i}`,
  likes: 100 + i,
  comments: 10 + i,
  user: {
    name: `ユーザー${i}`,
    avatar: `/placeholder.svg?user${i}`,
  },
}))

const events = Array.from({ length: 3 }, (_, i) => ({
  id: `event-${i}`,
  title: `バラ観賞会 ${i + 1}`,
  date: `2024年${5 + i}月15日 14:00〜`,
  location: `○○公園バラ園`,
  attendees: 50 + i * 10,
}))

export default function CommunityPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CommunityHeader community={community} />
        <div className="container py-8">
          <CommunityTabs posts={posts} events={events} />
        </div>
      </main>
    </div>
  )
}

