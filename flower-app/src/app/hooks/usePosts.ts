"use client";

import { useState, useCallback, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  profile_image: string;
  avatar: string;
}

export interface Post {
  id: number;
  image_url: string;
  caption: string;
  likes: number;
  comments: number;
  user: User;
  created_at: string;
  updated_at: string;
  tags: string[];
  variety_name: string;
  location: string;
  public_status: boolean;
}

export interface PaginatedPosts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export function usePosts() {
  // ページネーションオブジェクト全体を state で保持
  const [postData, setPostData] = useState<PaginatedPosts>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  // 現在のページ番号を管理
  const [currentPage, setCurrentPage] = useState(1);

  // 投稿データ取得
  const fetchPosts = useCallback(async (page: number) => {
    console.log("fetchPosts called, page=", page);
    try {
      // DRFに ?page=xxx を付けてリクエスト
      const response = await fetch(`https://127.0.0.1:8000/api/posts/?page=${page}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as PaginatedPosts;

      // ページネーションオブジェクトまるごと保存
      setPostData(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  // currentPage が変わるたびに取得
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  return {
    // ページネーション含むオブジェクトを返す
    postData,
    // 投稿配列は postData.results に格納されている
    posts: postData.results,
    // 現在ページと、ページ変更関数
    currentPage,
    setCurrentPage,
  };
}
