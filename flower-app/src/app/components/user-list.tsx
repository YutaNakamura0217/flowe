"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/PaginationControls";
import { UserPlus, UserCheck } from "lucide-react";

interface User {
  id: number;
  username: string;
  display_name?: string;
  email?: string;
  profile: {
    bio: string;
    cover_image: string;
    profile_image: string;
  };
  posts_count: number;
  followers_count: number;
  following_count: number;
}

interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

interface UserListProps {
  users: PaginatedUsers;
  currentPage: number;
  onPageChange: (page: number) => void;
  type: 'followers' | 'following';
}

export function UserList({ users, currentPage, onPageChange, type }: UserListProps) {
  const [followStatus, setFollowStatus] = useState<Record<number, boolean>>({});

  // フォロー/フォロー解除の処理
  const handleFollowToggle = async (userId: number) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/follow/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // フォロー状態を更新
        setFollowStatus(prev => ({
          ...prev,
          [userId]: data.status === 'followed'
        }));
      }
    } catch (error) {
      console.error('フォロー処理中にエラーが発生しました:', error);
    }
  };

  // フォロー状態を取得
  const fetchFollowStatus = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/accounts/users/${userId}/follow/status/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFollowStatus(prev => ({
          ...prev,
          [userId]: data.is_following
        }));
      }
    } catch (error) {
      console.error('フォロー状態の取得中にエラーが発生しました:', error);
    }
  }, []);

  // ユーザーごとにフォロー状態を取得
  useEffect(() => {
    if (users && users.results) {
      users.results.forEach(user => {
        fetchFollowStatus(user.id);
      });
    }
  }, [users, fetchFollowStatus]);

  if (!users || !users.results || users.results.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md shadow-md text-center">
        <p className="text-gray-600">
          {type === 'followers' ? 'フォロワーがいません。' : 'フォロー中のユーザーがいません。'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {users.results.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-md shadow-md flex items-center justify-between">
            <Link href={`/users/${user.id}`} className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={user.profile?.profile_image || "/placeholder-user.jpg"}
                  alt={user.username || "ユーザー"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{user.display_name || user.username}</h3>
                <p className="text-sm text-gray-500 truncate max-w-[200px]">{user.profile?.bio || "自己紹介はありません"}</p>
              </div>
            </Link>
            <Button
              variant={followStatus[user.id] ? "outline" : "default"}
              size="sm"
              onClick={() => handleFollowToggle(user.id)}
              className="ml-auto"
            >
              {followStatus[user.id] ? (
                <>
                  <UserCheck className="h-4 w-4 mr-1" />
                  フォロー中
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  フォローする
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {users.count > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(users.count / 20)} // 1ページあたり20件と仮定
          basePath={`/users/${type}`}
        />
      )}
    </div>
  );
}
