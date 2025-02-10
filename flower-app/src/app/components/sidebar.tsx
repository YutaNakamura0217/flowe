import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">おすすめコミュニティ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?${i}`} alt={`コミュニティ ${i}`} />
                  <AvatarFallback>C{i}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium leading-none">バラ愛好会 {i}</h3>
                  <p className="text-xs text-muted-foreground">メンバー: {100 * i}人</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                参加する
              </Button>
            </div>
          ))}
          <Link href="/communities" className="text-sm text-muted-foreground hover:underline block text-center">
            すべて見る
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">近日開催のイベント</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-sm font-medium">春のバラ撮影会 {i}</h3>
              <p className="text-xs text-muted-foreground">2024年3月{i}日 13:00〜</p>
              <p className="text-xs text-muted-foreground">参加予定: {20 * i}人</p>
            </div>
          ))}
          <Link href="/events" className="text-sm text-muted-foreground hover:underline block text-center">
            すべて見る
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

