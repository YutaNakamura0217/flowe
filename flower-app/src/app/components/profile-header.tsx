// components/profile-header.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User, FileText, Calendar, MapPin } from "lucide-react";
import { useFollowStatus } from "@/hooks/useFollowStatus";
import { useMyPage } from "@/hooks/useMyPage";

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
        joinedDate?: string; // Optional joined date
        location?: string;   // Optional location
    };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const { isFollowing, toggleFollow } = useFollowStatus({ userId: user.id }); // フックを使用
    const { data: myPageData } = useMyPage();

    const isMyPage = myPageData?.id === user.id;

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
                    <div className="space-y-3 bg-card/50 p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <h1 className="text-2xl font-bold">{user.username}</h1>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="ml-2 bg-primary/10 hover:bg-primary/20 cursor-default">
                                            花好き
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>花の投稿が多いユーザー</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        
                        {user.profile.bio && (
                            <div className="flex items-start gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <p className="text-muted-foreground">{user.profile.bio}</p>
                            </div>
                        )}
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            {user.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.joinedDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{user.joinedDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* ボタンの表示をフックから取得した isFollowing ステートによって切り替え */}
                    {!isMyPage && (
                        <Button className="mt-4 sm:mt-0" onClick={toggleFollow}>
                            {isFollowing ? 'フォロー解除' : 'フォロー'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
