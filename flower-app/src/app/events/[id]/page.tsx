"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import { EventDetails } from "@/components/event-details";
import { GoogleMap } from "@/components/google-map";
import { ParticipantList } from "@/components/participant-list";
import { CommentSection } from "@/components/comment-section";

import { useCsrfToken } from "@/hooks/useCsrfToken";
import { useEventDetail } from "@/hooks/useEventDetail";

interface Comment {
  id: string;
  user: {
    name: string;
    profile_image: string;
  };
  text: string;
  createdAt: string;
  likes: number;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = parseInt(id as string, 10);

  const { event, isLoading, error, refetch } = useEventDetail(eventId);

  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const csrfToken = useCsrfToken();

  const joinEvent = async () => {
    setIsJoining(true);
    setJoinError(null);

    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/events/${eventId}/attendance/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to join event");
      }
      refetch && refetch();
    } catch (error: any) {
      setJoinError(error.message);
    } finally {
      setIsJoining(false);
    }
  };

  // ロード中やエラーのハンドリング
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!event) return <div>Event not found</div>;

  // イベント詳細
  const formattedDate = new Date(event.date).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const eventDataForDetails = {
    id: event.id.toString(),
    title: event.title,
    organizer: event.organizer?.display_name ?? event.organizer?.username ?? "不明",
    date: formattedDate,
    location: event.location,
    description: event.description,
    maxParticipants: event.capacity ?? 0,
    currentParticipants: event.attendees?.length ?? 0,
    fee: event.fee ? Number(event.fee) : 0,
    isParticipating: false,
  };

  // 参加者リスト
  const participants = (event.attendees || []).map((attendee: any) => ({
    id: attendee.id.toString(),
    name: attendee.display_name ?? attendee.username ?? "名無しさん",
    avatar: attendee.profile?.profile_image || "/placeholder.svg",
  }));

  // 初期コメント（サンプル: 空配列）
  let initialComments: Comment[] = [];

  // ★ ここでコメントAPIを呼んで initialComments を作れば、最初からコメントを表示できる
  //  例: 
  //   const commentRes = await fetch(`https://...`);
  //   if (commentRes.ok) {
  //     const data = await commentRes.json();
  //     initialComments = data.map((d: any) => ... );
  //   }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* イベント詳細 */}
            <EventDetails event={eventDataForDetails} />

            {/* 地図 */}
            <GoogleMap address={event.location} />

            {/* コメントセクション */}
            <CommentSection
              resourceType="event"
              resourceId={String(eventId)}
              initialComments={initialComments}
            />
          </div>

          <div className="space-y-8">
            {/* 参加者一覧 */}
            <ParticipantList participants={participants} />

            {/* 参加ボタン */}
            <div>
              <button onClick={joinEvent} disabled={isJoining}>
                {isJoining ? "Joining..." : "Join Event"}
              </button>
              {joinError && <p className="text-red-500 mt-2">Error: {joinError}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
