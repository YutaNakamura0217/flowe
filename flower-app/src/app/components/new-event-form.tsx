"use client";

import React, { useState } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvent";

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

interface NewEventFormProps {
  communityId?: number;
  onEventCreated?: (newEvent: Event) => void;
}

const NewEventForm: React.FC<NewEventFormProps> = ({ communityId, onEventCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [fee, setFee] = useState("");
  const [isCommunityOnly, setIsCommunityOnly] = useState(false);

  const { createEvent, loading, error } = useCreateEvent(communityId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      date,
      location,
      capacity: capacity ? parseInt(capacity) : null,
      fee: fee ? parseFloat(fee) : null,
      is_community_only: communityId ? true : isCommunityOnly,
      community: communityId ?? null,
    };

    try {
      const newEvent = await createEvent(eventData);
      console.log("Event created successfully!", newEvent);
      if (onEventCreated) {
        onEventCreated(newEvent);
      }
      // フォームリセット
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setCapacity("");
      setFee("");
      setIsCommunityOnly(false);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date and Time
        </label>
        <input
          type="datetime-local"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          type="number"
          id="capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
          Fee
        </label>
        <input
          type="number"
          id="fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {communityId && (
        <div>
          <label htmlFor="isCommunityOnly" className="block text-sm font-medium text-gray-700">
            Community Only
          </label>
          <input
            type="checkbox"
            id="isCommunityOnly"
            checked={isCommunityOnly}
            onChange={(e) => setIsCommunityOnly(e.target.checked)}
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      )}
      <button
        type="submit"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default NewEventForm;
