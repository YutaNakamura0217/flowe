import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileHeaderProps {
  user: {
    id: string
    name: string
    avatar: string
    coverImage: string
    bio: string
    postsCount: number
    followersCount: number
    followingCount: number
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative h-40 sm:h-60 md:h-80">
        <Image
          src={user.coverImage || "/placeholder.svg"}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="container relative">
        <Avatar className="absolute -top-16 left-4 h-32 w-32 border-4 border-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="pt-20 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>
          <Button className="mt-4 sm:mt-0">フォロー</Button>
        </div>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <span>{user.postsCount} 投稿</span>
          <span>{user.followersCount} フォロワー</span>
          <span>{user.followingCount} フォロー中</span>
        </div>
      </div>
    </div>
  )
}

