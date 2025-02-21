// src/app/hooks/useFollowStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { useCsrfToken } from './useCsrfToken';

interface UseFollowStatusProps {
    userId: number;
    initialFollowing?: boolean;
}

export const useFollowStatus = ({ userId, initialFollowing }: UseFollowStatusProps = { userId: 0 }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowing || false);
    const csrfToken = useCsrfToken();

    const toggleFollowRequest = useCallback(async () => {
        // **Removed authToken check and retrieval**

        if (!csrfToken) {
            console.error('CSRF token is not available.');
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
                const errorData = await response.json();
                console.error('フォロー/フォロー解除エラー:', errorData);
                alert('フォロー/フォロー解除に失敗しました');
                return;
            }

            const responseData = await response.json();
            console.log('フォロー/フォロー解除レスポンス:', responseData);
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
    }, [userId, csrfToken]); // Added csrfToken as dependency

    const fetchInitialFollowStatusRequest = useCallback(async () => {
        // Removed authToken check and retrieval (not needed for GET request either, but harmless to leave token check out completely)

        try {
            const response = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/follow/status/`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            });

            if (!response.ok) {
                console.error('初期フォロー状態の取得に失敗:', response);
                return;
            }

            const responseData = await response.json();
            if (responseData.is_following) {
                setIsFollowing(true);
            } else {
                setIsFollowing(false);
            }

        } catch (error) {
            console.error('初期フォロー状態の取得リクエストに失敗しました:', error);
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