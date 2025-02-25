import Link from "next/link"
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EventListSkeleton } from "./EventSkeleton"

interface EventListProps {
  events: {
    id: number
    title: string
    date: string
    location: string
    attendees_count: number 
  }[]
  isLoading?: boolean
}

export function EventList({ events, isLoading = false }: EventListProps) {
  if (isLoading) {
    return <EventListSkeleton count={3} />;
  }

  // イベントがない場合のメッセージを表示
  if (events.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md shadow-md text-center">
        <p className="text-gray-600">イベントがありません。最初のイベントを作成しましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden bg-[#FFF0F5] hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <h3 className="text-lg font-bold">{event.title}</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>参加予定: {event.attendees_count}人</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Link href={`/events/${event.id}`}>
              <Button variant="outline">
                詳細を見る
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              参加する
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
