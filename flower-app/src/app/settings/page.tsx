// app/settings/page.tsx
import { Breadcrumb } from "@/components/breadcrumb";
import { SettingsTabs } from "@/components/settings-tabs";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "設定", href: "/settings" },
  ];

  return (
    <main className="flex-1 container py-8">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">設定</h1>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ホームに戻る
          </Link>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          アカウント、プロフィール、通知などの設定を管理します。これらの設定はいつでも変更できます。
        </p>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <SettingsTabs />
      </div>
    </main>
  );
}
