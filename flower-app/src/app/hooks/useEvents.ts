// src/app/hooks/useEvents.ts

import { useState, useCallback, useEffect } from "react";

export interface EventData {
  id: number;
  title: string;
  date: string;
  attendees: [];
}

export function useEvents(csrfToken: string) {
  const [events, setEvents] = useState<EventData[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      // Include your CSRF token in the headers:
      const response = await fetch("https://127.0.0.1:8000/api/events/", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Pass it here
        },
      });
      console.log("useEvents response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
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
