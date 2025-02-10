import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatedPost {
  id: string
  title: string
  imageUrl: string
  author: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">関連投稿</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {posts.map((post) => (
          <Card key={post.id} className="flex-shrink-0 w-64">
            <CardHeader className="p-0">
              <div className="relative w-full h-40">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">
                <Link href={`/posts/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">投稿者: {post.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

