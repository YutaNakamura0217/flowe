"use client"

import Image from "next/image"
import Link from "next/link"
import { Flower, MessageCircle, Share2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PostCardProps {
  post: {
    id: string
    imageUrl: string
    caption: string
    likes: number
    comments: number
    user: {
      name: string
      avatar: string
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    // 背景を本当に淡い「あわーい」ピンクに変更
    <Card className="overflow-hidden bg-[#FFF0F5]">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          {/* ユーザーアイコン：大きめに表示 */}
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="w-12 h-12" 
            />
            <AvatarFallback className="w-12 h-12">
              {post.user.name[0]}
            </AvatarFallback>
          </Avatar>
          {/* ユーザー名（太字）と投稿日時（小さめのグレー文字） */}
          <div className="flex-1 min-w-0">
            <Link 
              href={`/users/${post.user.name}`} 
              className="text-sm font-bold hover:underline"
            >
              {post.user.name}
            </Link>
            <span className="block text-xs text-gray-500">1時間前</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* 画像：角丸デザイン、ホバー時に拡大するアニメーション */}
        <div className="relative aspect-square group overflow-hidden rounded-lg">
          <Image
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.caption}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          {/* いいねボタン：花モチーフアイコンに変更 */}
          <Button variant="ghost" size="icon" aria-label="いいね">
            <Flower className="h-5 w-5 text-pink-400" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="コメント">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="シェア">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-sm">
          <span className="font-medium">{post.likes}件</span> のいいね
        </div>
        <p className="text-sm text-gray-700">{post.caption}</p>
        {/* コメントプレビュー（ダミー例：投稿にコメントがある場合のみ表示） */}
        {post.comments > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">最新のコメント: とても綺麗です！</p>
          </div>
        )}
        <Link 
          href={`/posts/${post.id}`} 
          className="text-sm text-muted-foreground hover:underline"
        >
          {post.comments}件のコメントをすべて見る
        </Link>
      </CardFooter>
    </Card>
  )
}

