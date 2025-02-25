"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserList } from "@/components/user-list";
import { useFollowUsers } from "@/hooks/useFollowUsers";

interface UserFollowModalProps {
  userId: number;
  type: "followers" | "following";
  isOpen: boolean;
  onClose: () => void;
}

export function UserFollowModal({ userId, type, isOpen, onClose }: UserFollowModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    users, 
    loading, 
    error, 
    fetchUsers
  } = useFollowUsers(userId, type);

  // モーダルが開いたときにデータを取得
  useEffect(() => {
    if (isOpen) {
      fetchUsers(currentPage);
    }
  }, [isOpen, currentPage, fetchUsers]);

  const title = type === "followers" ? "フォロワー" : "フォロー中";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-4 text-center">読み込み中...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">エラーが発生しました: {error}</div>
        ) : users ? (
          <UserList 
            users={users} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage}
            type={type}
          />
        ) : (
          <div className="py-4 text-center">
            {type === "followers" ? "フォロワーがいません。" : "フォロー中のユーザーがいません。"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
