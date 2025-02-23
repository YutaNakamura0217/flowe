"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import NewPostForm from "./NewPostForm";

interface NewPostModalProps {
  isOpen: boolean;                  // モーダル表示フラグ
  onClose: () => void;             // モーダルを閉じるコールバック
  onPostCreated: () => void;       // 投稿完了時のコールバック
  communityId: string;             // コミュニティID
}

export function NewPostModal({
  isOpen,
  onClose,
  onPostCreated,
  communityId,
}: NewPostModalProps) {
  // 投稿完了時にモーダルを閉じる
  const handlePostCreated = () => {
    onPostCreated();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景部分 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* モーダル本体 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6 shadow">
          <Dialog.Title className="text-xl font-semibold mb-4">新規投稿</Dialog.Title>

          {/* NewPostForm を配置し、投稿成功後はモーダルを閉じる */}
          <NewPostForm communityId={communityId} onPostCreated={handlePostCreated} />

          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={onClose}
            >
              キャンセル
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
