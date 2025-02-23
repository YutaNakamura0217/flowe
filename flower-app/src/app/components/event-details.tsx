import { CalendarDays, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EventDetailsProps {
  event: {
    id: string
    title: string
    organizer: string
    date: string
    location: string
    description: string
    maxParticipants: number | null;
    currentParticipants: number
    fee: number
    isParticipating: boolean
  }
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>
            {event.currentParticipants} / {event.maxParticipants} 参加者
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span>{event.fee > 0 ? `${event.fee}円` : "無料"}</span>
        </div>
        <p className="text-sm text-muted-foreground">主催者: {event.organizer}</p>
        <p>{event.description}</p>
        <Button className="w-full" variant={event.isParticipating ? "outline" : "default"}>
          {event.isParticipating ? "キャンセルする" : "参加する"}
        </Button>
      </CardContent>
    </Card>
  )
}

