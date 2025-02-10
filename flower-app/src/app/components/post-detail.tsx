import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface PostDetailProps {
  post: {
    id: string
    imageUrl: string
    caption: string
    likes: number
    comments: number
    flowerType: string
    location: string
    user: {
      name: string
      avatar: string
    }
  }
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="space-y-6">
      <div className="relative aspect-square w-full">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.caption}
          fill
          className="object-cover rounded-lg"
          sizes="(min-width: 1024px) 1024px, 100vw"
          priority
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/users/${post.user.name}`} className="font-medium hover:underline">
              {post.user.name}
            </Link>
            <p className="text-sm text-muted-foreground">投稿者</p>
          </div>
        </div>
        <Button variant="outline">フォロー</Button>
      </div>
      <div className="space-y-2">
        <p>{post.caption}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{post.flowerType}</Badge>
          <Badge variant="secondary">{post.location}</Badge>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="いいね">
          <Heart className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="コメント">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="シェア">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      <div>
        <span className="font-medium">{post.likes}件</span>のいいね
      </div>
    </div>
  )
}

