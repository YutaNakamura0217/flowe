"use client";

import { useState, useCallback, useEffect } from "react";
import { PaginatedPosts, PaginatedCommunities } from "../components/types";

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
  posts: PaginatedPosts;
  posts_count: number;
  followers_count: number;
  following_count: number;
  joined_date: string;
  favorites: PaginatedPosts;
  communities: PaginatedCommunities;
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
        console.log("API Response (jsonData):", jsonData);

        // Construct PaginatedPosts for 'posts'
        const paginatedPosts: PaginatedPosts = {
          count: jsonData.posts_count,
          next: null,
          previous: null,
          results: jsonData.posts,
        };

        // Construct PaginatedPosts for 'favorites'
        const paginatedFavorites: PaginatedPosts = {
          count: jsonData.favorites.length,
          next: null,
          previous: null,
          results: jsonData.favorites,
        };

        // Construct PaginatedCommunities for 'communities'
        const paginatedCommunities: PaginatedCommunities = {
          count: jsonData.communities.length,
          next: null,
          previous: null,
          results: jsonData.communities,
        };

        // Map the API response and constructed paginated objects to MyPageData
        const myPageData: MyPageData = {
          id: jsonData.id,
          username: jsonData.username,
          display_name: jsonData.display_name,
          bio: jsonData.bio,
          profile_image_url: jsonData.profile_image_url,
          cover_image_url: jsonData.cover_image_url,
          posts: paginatedPosts, // Use the constructed PaginatedPosts object
          posts_count: jsonData.posts_count,
          followers_count: jsonData.followers_count,
          following_count: jsonData.following_count,
          joined_date: jsonData.joined_date,
          favorites: paginatedFavorites,
          communities: paginatedCommunities,
        };
        console.log("Mapped Data (myPageData):", myPageData);
        setData(myPageData);
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
