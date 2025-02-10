import { Header } from "@/components/header"
import { EventDetails } from "@/components/event-details"
import { GoogleMap } from "@/components/google-map"
import { ParticipantList } from "@/components/participant-list"
import { CommentSection } from "@/components/comment-section"

// 仮のデータ
const event = {
  id: "1",
  title: "春のバラ観賞会",
  organizer: "バラ愛好会",
  date: "2024年5月15日 14:00〜",
  location: "○○公園バラ園",
  description: "美しく咲き誇る様々な種類のバラを観賞しながら、バラの育て方や品種についての知識を深めましょう。",
  maxParticipants: 50,
  currentParticipants: 30,
  fee: 500,
  isParticipating: false,
}

const participants = Array.from({ length: 30 }, (_, i) => ({
  id: `user-${i}`,
  name: `参加者${i + 1}`,
  avatar: `/placeholder.svg?user${i}`,
}))

const initialComments = Array.from({ length: 5 }, (_, i) => ({
  id: `comment-${i}`,
  user: {
    name: `コメント投稿者${i + 1}`,
    avatar: `/placeholder.svg?commenter${i}`,
  },
  content: `とても楽しみにしています！${i + 1}`,
  createdAt: `2024年${4 + i}月${10 + i}日`,
}))

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <EventDetails event={event} />
            <GoogleMap address={event.location} />
            <CommentSection initialComments={initialComments} />
          </div>
          <div className="space-y-8">
            <ParticipantList participants={participants} />
          </div>
        </div>
      </main>
    </div>
  )
}

