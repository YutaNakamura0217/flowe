"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

interface CommentSectionProps {
  initialComments: Comment[]
}

export function CommentSection({ initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: "Current User",
          avatar: "/placeholder.svg?user",
        },
        content: newComment,
        createdAt: new Date().toLocaleString(),
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">コメント ({comments.length})</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea placeholder="コメントを入力..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <Button type="submit">コメントを投稿</Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

