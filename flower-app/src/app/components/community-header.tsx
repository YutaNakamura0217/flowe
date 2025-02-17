import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CommunityHeaderProps {
  community: {
    id: number; // Change to number to match API response type
    name: string;
    cover_image: string; // Change to snake_case to match API response
    description: string;
    members_count: number; // Change to snake_case to match API response
    is_member: boolean; // Change to snake_case to match API response
  };
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative h-40 sm:h-60 md:h-80">
        <Image
          src={community.cover_image || "/placeholder.svg"} // Use cover_image
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{community.name}</h1>
            <p className="text-muted-foreground">{community.description}</p>
            <p className="text-sm text-muted-foreground">{community.members_count} メンバー</p> {/* Use members_count */}
          </div>
          <Button variant="default" className="mt-4 sm:mt-0">
            {community.is_member ? "退会する" : "参加する"} {/* Use is_member */}
          </Button>
        </div>
      </div>
    </div>
  )
}

