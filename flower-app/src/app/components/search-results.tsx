import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchResultsProps {
  type: "posts" | "users" | "communities"
  items: any[]
}

export function SearchResults({ type, items }: SearchResultsProps) {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground py-4">検索結果がありません。</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {type === "posts" && (
                <Link href={`/posts/${item.id}`} className="hover:underline">
                  {item.caption}
                </Link>
              )}
              {type === "users" && (
                <Link href={`/users/${item.id}`} className="hover:underline">
                  {item.name}
                </Link>
              )}
              {type === "communities" && (
                <Link href={`/communities/${item.id}`} className="hover:underline">
                  {item.name}
                </Link>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {type === "posts" && (
              <div className="aspect-square relative">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.caption}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            {type === "users" && (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">{item.bio}</p>
                </div>
              </div>
            )}
            {type === "communities" && (
              <div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-sm mt-2">{item.membersCount} メンバー</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

