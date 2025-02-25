"use client";

import { useState, useCallback } from "react";
import { useCsrfToken } from "@/hooks/useCsrfToken";

export interface NewEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number | null;
  fee: number | null;
  is_community_only: boolean;
  community: number | null;
}

export interface Event {
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

export function useCreateEvent(communityId?: number) {
  const csrfToken = useCsrfToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = useCallback(
    async (eventData: NewEventData): Promise<Event> => {
      setLoading(true);
      setError(null);

      const endpoint = communityId
        ? `https://127.0.0.1:8000/api/events/communities/${communityId}/events/`
        : `https://127.0.0.1:8000/api/events/`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Failed to create event: ${response.status} ${errText}`);
        }

        const data = await response.json();
        const newEvent: Event = {
          id: data.id,
          organizer: data.organizer,
          community: data.community,
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          capacity: data.capacity,
          fee: data.fee,
          created_at: data.created_at,
          attendees_count: 0, // 初期値として0
          is_community_only: data.is_community_only,
        };

        return newEvent;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [communityId, csrfToken]
  );

  return { createEvent, loading, error };
}
