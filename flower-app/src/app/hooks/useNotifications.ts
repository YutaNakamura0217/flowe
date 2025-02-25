"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: number;
  notification_type: string;
  sender_name: string | null;
  content_preview: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://127.0.0.1:8000/api/accounts/notifications/', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('通知の取得に失敗しました');
      }
      
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('通知の取得中にエラーが発生しました'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId?: number) => {
    try {
      const url = notificationId 
        ? `https://127.0.0.1:8000/api/accounts/notifications/${notificationId}/mark-read/`
        : 'https://127.0.0.1:8000/api/accounts/notifications/mark-read/';
      
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('通知の既読処理に失敗しました');
      }
      
      // 通知の状態を更新
      if (notificationId) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true } 
              : notification
          )
        );
      } else {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true }))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('通知の既読処理中にエラーが発生しました'));
    }
  };

  // ポーリング間隔（ミリ秒）
  const POLLING_INTERVAL = 10000; // 10秒ごとに通知を確認
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // useCallbackでfetchNotificationsをメモ化して、依存関係の変更時のみ再作成
  const memoizedFetchNotifications = useCallback(fetchNotifications, [isAuthenticated]);

  useEffect(() => {
    // 初回のみ通知を取得
    if (isAuthenticated) {
      memoizedFetchNotifications();
      
      // ポーリングを設定
      intervalRef.current = setInterval(() => {
        memoizedFetchNotifications();
      }, POLLING_INTERVAL);
    }

    // クリーンアップ関数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, memoizedFetchNotifications]);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.is_read).length,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  };
}
