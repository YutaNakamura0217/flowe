"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCsrfToken } from './useCsrfToken';

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    like: boolean;
    comment: boolean;
    follow: boolean;
    event_reminder: boolean;
    announcement: boolean;
  };
  notification_frequency: 'immediate' | 'daily' | 'weekly';
}

export const defaultSettings: NotificationSettings = {
  email_notifications: true,
  push_notifications: true,
  notification_types: {
    like: true,
    comment: true,
    follow: true,
    event_reminder: true,
    announcement: true,
  },
  notification_frequency: 'immediate',
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useAuth();
  const csrfToken = useCsrfToken();

  const fetchSettings = async () => {
    if (!isAuthenticated) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://127.0.0.1:8000/api/accounts/notification-settings/', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('通知設定の取得に失敗しました');
      }
      
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error('通知設定の取得エラー:', err);
      setError(err instanceof Error ? err : new Error('通知設定の取得中にエラーが発生しました'));
      // エラーが発生してもデフォルト設定を使用
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    if (!isAuthenticated || !csrfToken) {
      return false;
    }

    try {
      setSaving(true);
      const response = await fetch('https://127.0.0.1:8000/api/accounts/notification-settings/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) {
        throw new Error('通知設定の更新に失敗しました');
      }
      
      const data = await response.json();
      setSettings(data);
      return true;
    } catch (err) {
      console.error('通知設定の更新エラー:', err);
      setError(err instanceof Error ? err : new Error('通知設定の更新中にエラーが発生しました'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
  };
}
