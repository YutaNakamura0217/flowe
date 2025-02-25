"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  
  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // ドロップダウンを開いたときに全ての通知を既読にする
      markAsRead();
      setHasNewNotifications(false);
    }
  };

  // 通知をクリックしたときの処理
  const handleNotificationClick = (notification: any) => {
    // 通知を既読にする
    markAsRead(notification.id);
    
    // 通知タイプに応じて適切なページに遷移
    switch (notification.notification_type) {
      case "like":
      case "comment":
        if (notification.post) {
          router.push(`/posts/${notification.post}`);
        }
        break;
      case "follow":
        if (notification.sender_id) {
          router.push(`/users/${notification.sender_id}`);
        }
        break;
      case "event_reminder":
        if (notification.event) {
          router.push(`/events/${notification.event}`);
        }
        break;
      // その他の通知タイプに対する処理を追加
    }
    
    // ドロップダウンを閉じる
    setIsOpen(false);
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                markAsRead();
                // 視覚的なフィードバックを追加
                if (unreadCount > 0) {
                  setHasNewNotifications(false);
                }
              }}
            >
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
              <DropdownMenuItem 
                key={notification.id} 
                className="cursor-pointer p-4 hover:bg-gray-100"
                onClick={() => handleNotificationClick(notification)}
              >
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
