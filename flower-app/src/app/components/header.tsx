"use client";

import Link from "next/link";
import { Search, Bell, Flower, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserDropdown } from "@/components/user-dropdown";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <header className="relative sticky top-0 z-50 w-full bg-white border-b border-[#F0E68C]">
      {/* 背景に薄い花のシルエットを配置 */}
      <div className="absolute inset-0 bg-[url('/assets/floral-silhouette.png')] bg-no-repeat bg-center opacity-20 pointer-events-none" />
      <div className="container relative flex items-center px-4 h-16">
        {/* 左側：ロゴとナビゲーション */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 font-serif text-xl font-bold text-[#F08080]"
          >
            <Flower className="h-6 w-6" />
            <span>Flower Friends</span>
          </Link>
          {/* デスクトップ用ナビゲーション */}
          <nav className="hidden md:flex space-x-4 ml-8">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-[#F0E68C] hover:text-[#F0E68C]"
            >
              <Flower className="h-4 w-4 mr-1" />
              <span>ホーム</span>
            </Link>
            <Link
              href="/communities"
              className="flex items-center text-sm font-medium text-[#F0E68C] hover:text-[#F0E68C]"
            >
              <Flower className="h-4 w-4 mr-1" />
              <span>コミュニティ</span>
            </Link>
            <Link
              href="/mypage"
              className="flex items-center text-sm font-medium text-[#F0E68C] hover:text-[#F0E68C]"
            >
              <Flower className="h-4 w-4 mr-1" />
              <span>マイページ</span>
            </Link>
          </nav>
          {/* スマートフォン用ハンバーガーメニュー */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#F0E68C] ml-4"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">メニュー</span>
          </Button>
        </div>
        {/* 中央：検索バー */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-xl flex items-center space-x-2">
            <Input
              type="search"
              placeholder="花の名前や投稿を検索..."
              className="h-10 border border-pink-200 rounded-md"
            />
            <Button type="submit" size="icon" variant="ghost" className="text-[#F0E68C]">
              <Search className="h-5 w-5" />
              <span className="sr-only">検索</span>
            </Button>
          </div>
        </div>
        {/* 右側：通知とユーザー関連 */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-[#F0E68C]">
            <Bell className="h-6 w-6" />
            <span className="sr-only">通知</span>
          </Button>
          {loading ? (
            // 認証状態を取得中はローディング表示
            <span>Loading...</span>
          ) : isAuthenticated ? (
            // ログイン済みならユーザードロップダウンを表示
            <UserDropdown />
          ) : (
            // 未ログインならログインページへのリンクを表示
            <Link href="/login">
              <Button className="bg-[#F08080] hover:bg-[#e96262] text-white">
                ログイン
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
