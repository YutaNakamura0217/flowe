"use client";

import { useState, useCallback, useEffect } from "react";

// MyPageData インターフェースの定義例
interface MyPageData {
  id: number;
  username: string;
  display_name?: string;
  bio: string;
  profile_image_url?: string;
  cover_image_url?: string;
  posts: any[]; // 投稿の型が決まっていれば、例: Post[] に置き換えます
  posts_count: number;
  followers_count: number;
  following_count: number;
  joined_date: string;
  favorites: any;    // 型を明確にできる場合は適宜変更してください
  communities: any;  // 型を明確にできる場合は適宜変更してください
}

export function useMyPage() {
  const [data, setData] = useState<MyPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMyPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://127.0.0.1:8000/api/accounts/mypage/", {
        method: "GET",
        credentials: "include", // セッションCookieを送る
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
    fetchMyPage();
  }, [fetchMyPage]);

  return { data, loading, fetchMyPage };
}
