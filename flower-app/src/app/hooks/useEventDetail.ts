import { useState, useEffect, useCallback } from 'react';
import { EventSerializer } from '../components/types';
import { useCsrfToken } from './useCsrfToken';

interface UseEventDetailResult {
  event: EventSerializer | null;
  isLoading: boolean;
  error: Error | null;
  // 新たにrefetch関数を返す
  refetch: () => Promise<void>;
}

export const useEventDetail = (eventId: number): UseEventDetailResult => {
  const [event, setEvent] = useState<EventSerializer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const csrfToken = useCsrfToken();

  // イベント情報を取得する関数をuseCallbackでメモ化
  const fetchEvent = useCallback(async () => {
    // もし eventId が 0 や undefined ならスキップ
    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://127.0.0.1:8000/api/events/${eventId}/`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.status}`);
      }

      const data = await response.json();
      setEvent(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, csrfToken]);

  // 初回 & 依存が変わるたびに fetchEvent を呼び出す
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    isLoading,
    error,
    // 外部からも再取得可能にする
    refetch: fetchEvent,
  };
};
