"use client";

"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { EventSearchBar } from "@/components/event-search-bar";
import { EventList } from "@/components/event-list";
import NewEventForm from "@/components/new-event-form";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationEllipsis,
//   PaginationPrevious,
//   PaginationNext,
// } from "@/components/ui/pagination";

interface Event {
  id: number;
  organizer: {
    id: number;
    username: string;
  };
  community: {
    id: number;
    name: string;
  } | null;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  fee: number;
  created_at: string;
  attendees_count: number;
  is_community_only: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://127.0.0.1:8000/api/events/", {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // API のレスポンスに合わせて必要に応じてデータの加工を行う
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "イベント", href: "/events" },
  ];

  if (loading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  const handleAddEvent = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
  };

  return (
    <main className="flex-1 container py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">イベント一覧</h1>
      <div className="mb-8">
        <EventSearchBar />
      </div>
      <NewEventForm onEventCreated={handleAddEvent} />
      <EventList events={events} />
      {/* <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div> */}
    </main>
  );
}
