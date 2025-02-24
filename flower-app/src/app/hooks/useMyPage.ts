"use client";

import { useState, useCallback, useEffect } from "react";

interface Post {
  id: number;
  image_url: string;
  likes: number;
  comments: number;
}

// MyPageData インターフェースの定義例
interface MyPageData {
  id: number;
  username: string;
  display_name?: string;
  bio: string;
  profile_image_url?: string;
  cover_image_url?: string;
  posts: Post[];
  posts_count: number;
  followers_count: number;
  following_count: number;
  joined_date: string;
  favorites: any;
  communities: any;
}

export function useMyPage() {
  const [data, setData] = useState<MyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

    const fetchMyPage = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://127.0.0.1:8000/api/accounts/mypage/?page=${page}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      } else {
        console.error("マイページ情報の取得に失敗:", res.status);
      }
    } catch (error) {
      console.error("マイページ取得中のエラー:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPage(currentPage);
  }, [currentPage, fetchMyPage]);

  return { data, loading, fetchMyPage, currentPage, setCurrentPage };
}
