import { Header } from "@/components/header"
import { PostDetail } from "@/components/post-detail"
import { CommentList } from "@/components/comment-list"
import { CommentForm } from "@/components/comment-form"

// 仮のデータ
const post = {
  id: "1",
  imageUrl: "/placeholder.svg",
  caption: "美しいバラが咲きました！",
  likes: 100,
  comments: 10,
  flowerType: "バラ",
  location: "東京都新宿区",
  user: {
    name: "花子",
    avatar: "/placeholder.svg?user",
  },
}

const comments = [
  {
    id: "1",
    user: {
      name: "太郎",
      avatar: "/placeholder.svg?user1",
    },
    content: "素晴らしい写真ですね！",
    createdAt: "2時間前",
    likes: 5,
  },
  {
    id: "2",
    user: {
      name: "次郎",
      avatar: "/placeholder.svg?user2",
    },
    content: "この品種は何ですか？",
    createdAt: "1時間前",
    likes: 2,
  },
]

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <PostDetail post={post} />
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">コメント</h2>
            <CommentList comments={comments} />
            <CommentForm postId={params.id} onSubmit={(comment) => console.log("New comment:", comment)} />
          </div>
        </div>
      </main>
    </div>
  )
}

