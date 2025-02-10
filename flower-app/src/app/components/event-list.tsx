import Link from "next/link"
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EventListProps {
  events: {
    id: string
    title: string
    date: string
    location: string
    attendees: number
  }[]
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden bg-[#FFF0F5] hover:shadow-lg transition-shadow">
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
              <span>参加予定: {event.attendees}人</span>
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

