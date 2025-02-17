// app/settings/page.tsx
import { Breadcrumb } from "@/components/breadcrumb";
import { SettingsTabs } from "@/components/settings-tabs";

export default function SettingsPage() {
  const breadcrumbItems = [
    { label: "ホーム", href: "/" },
    { label: "設定", href: "/settings" },
  ];

  return (
    <main className="flex-1 container py-8">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">設定</h1>
      <SettingsTabs />
    </main>
  );
}

