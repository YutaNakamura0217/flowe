"use client";

import { useState, useCallback, useEffect } from "react";

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

export function useFollowUsers(userId: number, type: 'followers' | 'following') {
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = type === 'followers' 
        ? `https://127.0.0.1:8000/api/accounts/users/${userId}/followers/?page=${page}`
        : `https://127.0.0.1:8000/api/accounts/users/${userId}/following/?page=${page}`;
      
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error(`Error fetching ${type}:`, err);
      setError(err.message || `${type}の取得中にエラーが発生しました`);
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  return { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    currentPage, 
    setCurrentPage 
  };
}
