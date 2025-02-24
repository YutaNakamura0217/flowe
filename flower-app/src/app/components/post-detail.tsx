// src/components/post-detail.tsx
"use client";

import Image from "next/image"
import Link from "next/link"
import { Flower, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// いいねトグルのフック
import { useToggleLike } from "@/hooks/useToggleLike"

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
      id: number;
      name: string;
      profile_image: string;
    };
    tags?: string[];
  };
  currentUserId?: number;
  csrfToken: string; // Add csrfToken prop
}

export function PostDetail({ post, currentUserId, csrfToken }: PostDetailProps) {
  const [likesCount, setLikesCount] = useState<number>(post.likes)
  const { toggleLike, isLoading, error } = useToggleLike()
  const handleLikeClick = async () => {
    const result = await toggleLike(Number(post.id), csrfToken) // Pass csrfToken
    if (result) {
      setLikesCount(result.likes_count)
    }
  }

  return (
    <div className="space-y-6">
      {/* 画像表示 */}
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
      
      {/* ユーザー情報 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.user.profile_image} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/users/${post.user.id}`} className="font-medium hover:underline">
              {post.user.name}
            </Link>
            <p className="text-sm text-muted-foreground">投稿者</p>
          </div>
        </div>
        {currentUserId !== undefined && post.user.id !== undefined && currentUserId !== Number(post.user.id) && (
          <Button variant="outline">フォロー</Button>
        )}
      </div>
      
      {/* 投稿内容 & タグ */}
      <div className="space-y-2">
        <p>{post.caption}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{post.flowerType}</Badge>
          <Badge variant="secondary">{post.location}</Badge>
          {post.tags?.map((tag, index) => (
            <Badge variant="secondary" key={index}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* いいね・コメント・シェア ボタン */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="いいね"
          onClick={handleLikeClick}
          disabled={isLoading}
        >
          <Flower className="h-5 w-5 text-pink-400" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="コメント">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="シェア">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      {/* いいね数 表示 (ローカルステートのlikesCount) */}
      <div>
        <span className="font-medium">{likesCount}件</span>のいいね
      </div>

      {/* エラー表示 */}
      {error && <p className="text-red-600">いいね操作失敗: {error.message}</p>}
    </div>
  )
}
