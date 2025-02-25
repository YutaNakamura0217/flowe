"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  const prevUnreadCountRef = useRef(unreadCount);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // ドロップダウンを開いたときに全ての通知を既読にする
      markAsRead();
      setHasNewNotifications(false);
    }
  };

  // 新しい通知が来たときの視覚的なフィードバック
  useEffect(() => {
    // 未読数が増えた場合、新しい通知があると判断
    if (unreadCount > prevUnreadCountRef.current) {
      setHasNewNotifications(true);
      
      // ベルアイコンをアニメーションさせるなどの視覚的フィードバックも可能
    }
    
    // 現在の未読数を保存
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const getNotificationIcon = (type: string) => {
    // 通知タイプに応じたアイコンを返す
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👤";
      case "event_reminder":
        return "📅";
      case "announcement":
        return "📢";
      default:
        return "🔔";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative text-[#F0E68C] ${hasNewNotifications ? 'animate-pulse' : ''}`}
        >
          <Bell className={`h-6 w-6 ${hasNewNotifications ? 'animate-bounce' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">通知</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">通知</h2>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAsRead()}>
              すべて既読にする
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">通知はありません</div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-default p-4">
                <div className="flex items-start gap-3">
                  <div className="text-xl">{getNotificationIcon(notification.notification_type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{notification.sender_name || "システム"}</span>
                      {!notification.is_read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.content_preview}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
