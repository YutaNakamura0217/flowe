import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CommunityHeaderProps {
  community: {
    id: string
    name: string
    coverImage: string
    description: string
    membersCount: number
    isMember: boolean
  }
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative h-40 sm:h-60 md:h-80">
        <Image
          src={community.coverImage || "/placeholder.svg"}
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
            <p className="text-sm text-muted-foreground">{community.membersCount} メンバー</p>
          </div>
          <Button variant="default" className="mt-4 sm:mt-0">
            {community.isMember ? "退会する" : "参加する"}
          </Button>
        </div>
      </div>
    </div>
  )
}

