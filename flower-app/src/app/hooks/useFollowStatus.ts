// src/app/hooks/useFollowStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { useCsrfToken } from './useCsrfToken';

interface UseFollowStatusProps {
  userId: number;
  initialFollowing?: boolean;
}

export const useFollowStatus = ({
  userId,
  initialFollowing,
}: UseFollowStatusProps = { userId: 0 }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowing || false);
  const csrfToken = useCsrfToken();

  const toggleFollowRequest = useCallback(async () => {
    if (!csrfToken) {
      alert('CSRFトークンを取得できませんでした。ページをリロードしてください。');
      return;
    }

    try {
      const response = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/follow/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        alert('フォロー/フォロー解除に失敗しました');
        return;
      }
      const responseData = await response.json();
      if (responseData.status === 'followed') {
        setIsFollowing(true);
        alert('フォローしました！');
      } else if (responseData.status === 'unfollowed') {
        setIsFollowing(false);
        alert('フォロー解除しました！');
      }
    } catch (error) {
      console.error('フォロー/フォロー解除リクエストに失敗しました:', error);
      alert('フォロー/フォロー解除リクエストに失敗しました');
    }
  }, [userId, csrfToken]);

  const fetchInitialFollowStatusRequest = useCallback(async () => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/follow/status/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return;
      }

      const responseData = await response.json();
      setIsFollowing(responseData.is_following);
    } catch (error) {
        console.error('フォロー状態取得リクエストに失敗しました:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchInitialFollowStatusRequest();
    } else {
      setIsFollowing(false);
    }
  }, [userId, fetchInitialFollowStatusRequest]);

  const toggleFollow = useCallback(() => {
    toggleFollowRequest();
  }, [toggleFollowRequest]);

  return { isFollowing, toggleFollow };
};
