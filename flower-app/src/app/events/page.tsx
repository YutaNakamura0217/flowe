"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { EventSearchBar } from "@/components/event-search-bar";
import { EventList } from "@/components/event-list";
import { EventPageSkeleton } from "@/components/EventSkeleton";
import { NewEventModal } from "@/components/NewEventModal";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees_count: number;
  // ...
}

// ページネーション付きレスポンスの型
interface PaginatedEvents {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export default function EventsPage() {
  // ページネーション含むレスポンス全体をステート管理
  const [eventsData, setEventsData] = useState<PaginatedEvents>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState<number>(1);

    const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };


  useEffect(() => {
    async function fetchEvents(page: number) {
      setLoading(true);
      setError(null);
      try {
        // DRFページネーションで ?page=xxx を指定
        const res = await fetch(`https://127.0.0.1:8000/api/events/?page=${page}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = (await res.json()) as PaginatedEvents;
        setEventsData(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents(currentPage);
  }, [currentPage]);

  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "イベント", href: "/events" },
  ];

  const handleAddEvent = (eventId: number) => {
    // Fetch the newly created event and add it to the list
    async function fetchNewEvent() {
      try {
        const res = await fetch(`https://127.0.0.1:8000/api/events/${eventId}/`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const newEvent = await res.json();
            setEventsData((prev) => ({
                ...prev,
                results: [newEvent, ...prev.results],
                count: prev.count + 1,
            }));

      } catch (err) {
        console.error("Error fetching new event:", err);
      }
    }
    fetchNewEvent()
  };

    // ページ移動ハンドラー
  const goToNextPage = () => {
    // nextがnullでなければ currentPage + 1 へ
    if (eventsData.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    // previousがnullでなければ currentPage - 1 へ
    if (eventsData.previous && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <EventPageSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <main className="flex-1 container py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">イベント一覧</h1>
      <div className="mb-8">
        <EventSearchBar />
      </div>

      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        イベント作成
      </button>

      <NewEventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onEventCreated={handleAddEvent}
      />

      {/* イベント表示 */}
      <EventList events={eventsData.results} />

      {/* ページネーションコントロール */}
      <div className="flex items-center justify-center mt-8 space-x-4">
        <button
          onClick={goToPreviousPage}
          disabled={!eventsData.previous || currentPage === 1}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          ← 前へ
        </button>
        <span>ページ {currentPage}</span>
        <button
          onClick={goToNextPage}
          disabled={!eventsData.next}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          次へ →
        </button>
      </div>
    </main>
  );
}
