import Link from "next/link"
import Image from "next/image"
import { Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommunityCardProps {
  id: string
  name: string
  description: string
  memberCount: number
  imageUrl: string
}

export function CommunityCard({ id, name, description, memberCount, imageUrl }: CommunityCardProps) {
  return (
    <Card className="overflow-hidden bg-[#FFF0F5] hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video group overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2">
          <Link href={`/communities/${id}`} className="hover:underline">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" alt="メンバーアイコン" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{memberCount} メンバー</span>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full">
          <Users className="h-5 w-5 mr-2" />
          参加する
        </Button>
      </CardFooter>
    </Card>
  )
}

