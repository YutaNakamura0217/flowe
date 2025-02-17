// components/profile-header.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: {
    id: number;
    username: string;
    profile: {
      bio: string;
      cover_image: string;
      profile_image: string;
    };
    posts_count: number;
    followers_count: number;
    following_count: number;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="space-y-4">
      {/* カバー画像 */}
      <div className="relative h-40 sm:h-60 md:h-80">
        <Image
          src={user.profile.cover_image || "/placeholder.svg"}
          alt="Cover Image"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="container relative">
        {/* アバター */}
        <Avatar className="absolute -top-16 left-4 h-32 w-32 border-4 border-background">
          <AvatarImage
            src={user.profile.profile_image || "/placeholder-avatar.svg"}
            alt={user.username}
          />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div className="pt-20 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">{user.profile.bio}</p>
          </div>
          <Button className="mt-4 sm:mt-0">フォロー</Button>
        </div>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <span>{user.posts_count} 投稿</span>
          <span>{user.followers_count} フォロワー</span>
          <span>{user.following_count} フォロー中</span>
        </div>
      </div>
    </div>
  );
}
