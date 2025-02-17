import { useState, useCallback, useEffect } from "react"

export interface EventData {
  id: number
  title: string
  date: string
  attendees: number
}

export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([])

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("https://127.0.0.1:8000/api/events/")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return { events, fetchEvents }
}
