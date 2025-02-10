import { Header } from "@/components/header"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileTabs } from "@/components/profile-tabs"

// 仮のデータ
const user = {
  id: "1",
  name: "花子",
  avatar: "/placeholder.svg?user",
  coverImage: "/placeholder.svg?cover",
  bio: "花が大好きです。特にバラが好きです。",
  postsCount: 42,
  followersCount: 1000,
  followingCount: 500,
}

const posts = Array.from({ length: 9 }, (_, i) => ({
  id: `post-${i}`,
  imageUrl: `/placeholder.svg?post${i}`,
  likes: 100 + i,
  comments: 10 + i,
}))

const favorites = Array.from({ length: 6 }, (_, i) => ({
  id: `favorite-${i}`,
  imageUrl: `/placeholder.svg?favorite${i}`,
  likes: 50 + i,
  comments: 5 + i,
}))

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProfileHeader user={user} />
        <div className="container py-8">
          <ProfileTabs posts={posts} favorites={favorites} />
        </div>
      </main>
    </div>
  )
}

