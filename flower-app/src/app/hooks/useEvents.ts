// src/app/hooks/useEvents.ts
import { useState, useCallback, useEffect } from "react";

export interface EventData {
  id: number;
  title: string;
  date: string;
  attendees: [];
}

interface PaginatedEvents {
  count: number;
  next: string | null;
  previous: string | null;
  results: EventData[];
}

export function useEvents(csrfToken: string) {
  const [events, setEvents] = useState<EventData[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("https://127.0.0.1:8000/api/events/", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });
      console.log("useEvents response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as PaginatedEvents;
      // ページネーション対応 → data.results（イベント配列）だけを state に保存
      setEvents(data.results);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [csrfToken]);

  useEffect(() => {
    if (csrfToken) {
      fetchEvents();
    }
  }, [fetchEvents, csrfToken]);

  return { events, fetchEvents };
}
