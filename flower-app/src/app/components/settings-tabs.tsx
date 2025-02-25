// src/components/settings-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { AccountSettingsForm } from "@/components/account-settings-form";
import { NotificationSettingsForm } from "@/components/notification-settings-form";
import { useProfile } from "@/hooks/useProfile";

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, loading } = useProfile();

  return (
    <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">プロフィール</TabsTrigger>
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="notifications">通知</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        {loading ? (
          <div>Loading...</div>
        ) : profile ? (
          <ProfileSettingsForm initialProfile={profile} />
        ) : (
          <div>プロフィール情報が見つかりませんでした</div>
        )}
      </TabsContent>

      <TabsContent value="account">
        <AccountSettingsForm />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettingsForm />
      </TabsContent>
    </Tabs>
  );
}
