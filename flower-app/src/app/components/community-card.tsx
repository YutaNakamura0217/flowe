'use client';
// components/community-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Community } from "@/components/types";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { useState } from "react";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {

  return (
     <Card className="overflow-hidden bg-[#FFF0F5] hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video group overflow-hidden rounded-t-lg">
          <Image
            src={community.cover_image || "/placeholder.svg"}
            alt={community.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2">
          <Link href={`/communities/${community.id}`} className="hover:underline">
            {community.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {community.description}
        </p>
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" alt="メンバーアイコン" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {community.member_count
              ? community.member_count
              : community.members_count}{" "}
            メンバー
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/communities/${community.id}`}>
          <Button
            className="w-full"
          >
            詳細を見る
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
