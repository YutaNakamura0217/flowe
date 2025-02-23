// components/comment-form.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCsrfToken } from '@/hooks/useCsrfToken';

interface CommentFormProps {
  eventId: string;
  onCommentPosted: (newComment: string) => void;
}

export function CommentForm({ eventId, onCommentPosted }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const csrfToken = useCsrfToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const res = await fetch(
          `https://127.0.0.1:8000/api/events/${eventId}/comments/`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            // キーを"text"に変更（モデルのフィールド名に合わせる）
            body: JSON.stringify({ text: comment }),
          }
        );
        if (!res.ok) {
          throw new Error('Failed to post comment');
        }
        console.log('Comment posted successfully');
        // 投稿成功後、コールバックを呼ぶ
        onCommentPosted(comment);
      } catch (error) {
        console.error(error);
      }
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="コメントを入力..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={!comment.trim()}>
        コメントを投稿
      </Button>
    </form>
  );
}
