"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCsrfToken } from './useCsrfToken';

export interface AccountSettings {
  email: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  language?: string;
  timezone?: string;
  privacy_level?: 'public' | 'followers' | 'private';
}

export function useAccountSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated, user, refreshAuth } = useAuth();
  const csrfToken = useCsrfToken();

  const updateAccountSettings = async (settings: AccountSettings) => {
    if (!isAuthenticated || !csrfToken) {
      return false;
    }

    try {
      setSaving(true);
      
      // パスワード変更のバリデーション
      if (settings.new_password) {
        if (!settings.current_password) {
          throw new Error('現在のパスワードを入力してください');
        }
        if (settings.new_password !== settings.confirm_password) {
          throw new Error('新しいパスワードと確認用パスワードが一致しません');
        }
        if (settings.new_password.length < 8) {
          throw new Error('パスワードは8文字以上である必要があります');
        }
      }

      const response = await fetch('https://127.0.0.1:8000/api/accounts/settings/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          email: settings.email,
          current_password: settings.current_password,
          new_password: settings.new_password,
          language: settings.language,
          timezone: settings.timezone,
          privacy_level: settings.privacy_level,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'アカウント設定の更新に失敗しました');
      }
      
      const data = await response.json();
      
      // 認証情報を更新（メールアドレスが変更された場合など）
      await refreshAuth();
      
      return true;
    } catch (err) {
      console.error('アカウント設定の更新エラー:', err);
      setError(err instanceof Error ? err : new Error('アカウント設定の更新中にエラーが発生しました'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async (password: string) => {
    if (!isAuthenticated || !csrfToken) {
      return false;
    }

    try {
      setSaving(true);
      
      const response = await fetch('https://127.0.0.1:8000/api/accounts/delete/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'アカウントの削除に失敗しました');
      }
      
      // ログアウト処理は AuthContext で行われることを想定
      return true;
    } catch (err) {
      console.error('アカウント削除エラー:', err);
      setError(err instanceof Error ? err : new Error('アカウントの削除中にエラーが発生しました'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    updateAccountSettings,
    deleteAccount,
  };
}
