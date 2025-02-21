"use client";

import Image from "next/image";
import Link from "next/link";
import { Flower, MessageCircle, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useToggleLike } from "@/hooks/useToggleLike";

interface PostCardProps {
  post: {
    id: number;
    image_url: string;
    caption: string;
    likes: number;
    comments: number;
    user: {
      id: number;
      username: string;
      display_name?: string;
      profile_image: string;
      avatar: string;
    };
    created_at: string;
    updated_at: string;
  };
  csrfToken: string; // Add csrfToken prop
}

export function PostCard({ post, csrfToken }: PostCardProps) {
   // ローカルステートにlikesをコピー
  const [likesCount, setLikesCount] = useState(post.likes);

  // いいねトグルフック
  const { toggleLike, isLoading, error } = useToggleLike();

  // ボタンが押された時の処理
  const handleLikeClick = async () => {
    const result = await toggleLike(post.id, csrfToken); // Pass csrfToken
    if (result) {
      // APIから返ってきた最新のいいね数を反映
      setLikesCount(result.likes_count);
    }
  };

  return (
    <Card className="overflow-hidden bg-[#FFF0F5]">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={post.user.profile_image}
              alt={post.user.display_name}
              className="w-12 h-12"
            />
            <AvatarFallback className="w-12 h-12">
              {post.user.username[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link
              href={`/users/${post.user.id}`}
              className="text-sm font-bold hover:underline"
            >
              {post.user.display_name || post.user.username}
            </Link>
            <span className="block text-xs text-gray-500">1時間前</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-square group overflow-hidden rounded-lg">
          <Image
            src={post.image_url || "/placeholder.svg"}
            alt={post.caption}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          {/* いいねボタン */}
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
        {/* いいね数 (ローカルステート) */}
        <div className="text-sm">
          <span className="font-medium">{likesCount}件</span> のいいね
        </div>
        <p className="text-sm text-gray-700">{post.caption}</p>
        {post.comments > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              最新のコメント: とても綺麗です！
            </p>
          </div>
        )}
        <Link href={`/posts/${post.id}`} className="text-sm text-muted-foreground hover:underline">
          {post.comments}件のコメントをすべて見る
        </Link>

        {error && (
          <p className="text-red-500 text-sm mt-2">
            いいね操作に失敗: {error.message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
