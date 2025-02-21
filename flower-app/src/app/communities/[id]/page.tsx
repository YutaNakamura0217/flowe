"use client";
import { Header } from "@/components/header"
import { CommunityHeader } from "@/components/community-header"
import { CommunityTabs } from "@/components/community-tabs"
import { useEffect, useState } from "react";

// APIレスポンスの型定義 (必要に応じて詳細化)
interface CommunityApiResponse {
 id: number;
 name: string;
 description: string;
 cover_image: string;
 members_count: number;
 is_member: boolean;
 posts: any[];
 events: any[];
}

export default function CommunityPage({ params }: { params: { id: string } }) {
 const [communityData, setCommunityData] = useState<CommunityApiResponse | null>(null); // Stateをnullで初期化、型を定義
 const [loading, setLoading] = useState<boolean>(true); // ローディング状態を管理
 const [error, setError] = useState<Error | null>(null); // エラー状態を管理
 const communityId = params.id;

 useEffect(() => {
  const fetchCommunityData = async () => {
   setLoading(true); // ローディング開始
   setError(null); // エラーをリセット
   try {
    const response = await fetch(`https://127.0.0.1:8000/api/communities/${communityId}/`, {
     credentials: "include",
    }); // APIエンドポイントを指定 (バックエンドのURLに合わせる)
    if (!response.ok) {
     throw new Error(`APIリクエストエラー: ${response.status}`); // エラーレスポンスの場合、エラーを投げる
    }
    const data: CommunityApiResponse = await response.json() as CommunityApiResponse; // レスポンスをJSONとして解析、型をアサーション
    setCommunityData(data); // 取得したデータをStateにセット
   } catch (e) {
    if (e instanceof Error) {
     setError(e); // エラーをStateにセット
     console.error("データ取得中にエラーが発生しました:", e); // 開発者向けにコンソールにもエラー出力
    } else {
     setError(new Error("不明なエラーが発生しました"));
     console.error("不明なエラーが発生しました:", e);
    }
   } finally {
    setLoading(false); // ローディング終了 (成功・失敗に関わらず)
   }
  };

  fetchCommunityData();
 }, [communityId]); // communityId が変更された時のみuseEffectを再実行

 if (loading) {
  return <div>ロード中...</div>; // ローディング中はロード中表示
 }

 if (error) {
  return <div>エラーが発生しました: {error.message}</div>; // エラー発生時はエラーメッセージ表示
 }

 if (!communityData) {
  return <div>コミュニティが見つかりませんでした。</div>; // データが取得できなかった場合はメッセージ表示
 }

 return (
  <div className="min-h-screen flex flex-col">
   <main className="flex-1">
    <CommunityHeader community={communityData} /> {/* APIから取得したデータを渡す */}
    <div className="container py-8">
     <CommunityTabs posts={communityData.posts} events={communityData.events} /> {/* APIから取得したデータを渡す */}
    </div>
   </main>
  </div>
 )
}
