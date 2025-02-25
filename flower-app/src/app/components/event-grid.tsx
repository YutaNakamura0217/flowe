import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventGridSkeleton } from "./EventSkeleton";

interface EventGridProps {
  events: {
    id: number;
    title: string;
    date: string;
    location: string;
    attendees_count: number;
  }[];
  isLoading?: boolean;
}

export function EventGrid({ events, isLoading = false }: EventGridProps) {
  if (isLoading) {
    return <EventGridSkeleton count={6} />;
  }

  if (events.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md shadow-md text-center">
        <p className="text-gray-600">イベントがありません。最初のイベントを作成しましょう！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden bg-[#FFF0F5] hover:shadow-lg transition-shadow h-full flex flex-col"
        >
          <CardHeader>
            <h3 className="text-lg font-bold truncate">{event.title}</h3>
          </CardHeader>
          <CardContent className="space-y-2 flex-grow">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>参加予定: {event.attendees_count}人</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center mt-auto">
            <Link href={`/events/${event.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                詳細を見る
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
