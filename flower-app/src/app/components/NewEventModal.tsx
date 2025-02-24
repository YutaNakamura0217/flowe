"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import NewEventForm from "./new-event-form";

interface NewEventModalProps {
  isOpen: boolean;               // モーダル表示フラグ
  onClose: () => void;          // モーダルを閉じるコールバック
  communityId?: number;          // コミュニティID (number型)
  onEventCreated?: (id: number) => void;
}

export function NewEventModal({
  isOpen,
  onClose,
  communityId,
  onEventCreated,
}: NewEventModalProps) {
  // イベント作成後のコールバック
  const handleEventCreated = (evt: any) => {
    // 必要に応じて呼び出し元に通知
    if (onEventCreated) {
      onEventCreated(evt.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景部分 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* モーダル本体 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6 shadow">
          <Dialog.Title className="text-xl font-semibold mb-4">新規イベント</Dialog.Title>

          {/* NewEventForm を配置し、作成成功後はモーダルを閉じる */}
          <NewEventForm
            communityId={communityId}
            onEventCreated={handleEventCreated}
          />

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
