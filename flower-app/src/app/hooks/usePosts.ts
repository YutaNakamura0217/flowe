"use client";

import { useState, useCallback, useEffect } from "react"

interface User {
  id: number
  username: string
  email: string
  display_name: string
  profile_image: string
  avatar: string
}
interface Post {
  id: number
  image_url: string
  caption: string
  likes: number
  comments: number
  user: User
  created_at: string
  updated_at: string
  tags: string[]
  variety_name: string
  location: string
  public_status: boolean
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])

  const fetchPosts = useCallback(async () => {
    console.log("fetchPosts called");
    try {
      const response = await fetch("https://127.0.0.1:8000/api/posts/")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const rawData = await response.json()
      const data: Post[] = rawData.map((item: any) => ({
        id: item.id,
        image_url: item.image_url,
        caption: item.caption,
        likes: item.likes,
        comments: item.comments,
        user: {
          id: item.user.id,
          username: item.user.username,
          email: item.user.email,
          display_name: item.user.display_name,
          profile_image: item.user.profile_image,
          avatar: item.user.avatar,
        },
        created_at: item.created_at,
        updated_at: item.updated_at,
        tags: item.tags,
        variety_name: item.variety_name,
        location: item.location,
        public_status: item.public_status,
      }))
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }, [])

  useEffect(() => {
    console.log("usePosts: useEffect triggered");
    fetchPosts()
  }, [fetchPosts])

  return { posts, fetchPosts }
}
