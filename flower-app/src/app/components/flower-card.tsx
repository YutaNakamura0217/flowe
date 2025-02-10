import Image from "next/image"
import Link from "next/link"
import { Flower, Info } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FlowerCardProps {
  id: string
  name: string
  scientificName: string
  family: string
  imageUrl: string
}

export function FlowerCard({ id, name, scientificName, family, imageUrl }: FlowerCardProps) {
  return (
    <Card className="overflow-hidden bg-[#FFF0F5] hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-square group overflow-hidden rounded-t-lg">
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
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground">{scientificName}</p>
        <p className="text-sm text-muted-foreground">{family}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" className="text-pink-400">
          <Flower className="h-5 w-5 mr-1" />
          詳細
        </Button>
        <Link href={`/zukan/detail/${id}`}>
          <Button variant="ghost" size="sm">
            <Info className="h-5 w-5 mr-1" />
            図鑑を見る
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

