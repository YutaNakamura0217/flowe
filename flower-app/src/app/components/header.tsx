// src/components/header.tsx
"use client";

import Link from "next/link";
import { Search, Bell, Flower, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserDropdown } from "@/components/user-dropdown";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <header className="relative sticky top-0 z-50 w-full bg-white border-b border-[#F0E68C]">
      <div className="absolute inset-0 bg-[url('/assets/floral-silhouette.png')] bg-no-repeat bg-center opacity-20 pointer-events-none" />
      <div className="container relative flex items-center px-4 h-16">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 font-serif text-xl font-bold text-[#F08080]"
          >
            <Flower className="h-6 w-6" />
            <span>Flower Friends</span>
          </Link>
          <nav className="hidden md:flex space-x-4 ml-8">
            <Link href="/" className="flex items-center text-sm font-medium text-[#F0E68C] hover:text-[#F0E68C]">
              <Flower className="h-4 w-4 mr-1" />
              <span>ホーム</span>
            </Link>
            <Link href="/communities" className="flex items-center text-sm font-medium text-[#F0E68C] hover:text-[#F0E68C]">
              <Flower className="h-4 w-4 mr-1" />
              <span>コミュニティ</span>
            </Link>
            <Link href="/mypage" className="flex items-center text-sm font-medium text-[#F0E68C] hover:text-[#F0E68C]">
              <Flower className="h-4 w-4 mr-1" />
              <span>マイページ</span>
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden text-[#F0E68C] ml-4">
            <Menu className="h-6 w-6" />
            <span className="sr-only">メニュー</span>
          </Button>
        </div>
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
        <div className="flex items-center space-x-4">
          {isAuthenticated && <NotificationDropdown />}
          {loading ? (
            <span>Loading...</span>
          ) : isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Link href="/login">
              <Button className="bg-[#F08080] hover:bg-[#e96262] text-white">ログイン</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
