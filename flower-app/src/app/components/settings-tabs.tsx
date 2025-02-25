// src/components/settings-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { AccountSettingsForm } from "@/components/account-settings-form";
import { NotificationSettingsForm } from "@/components/notification-settings-form";
import { useProfile } from "@/hooks/useProfile";
import { User, Shield, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, loading } = useProfile();

  return (
    <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 p-0 bg-card border-b rounded-none">
        <TabsTrigger 
          value="profile" 
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          <User className="h-4 w-4" />
          プロフィール
        </TabsTrigger>
        <TabsTrigger 
          value="account" 
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          <Shield className="h-4 w-4" />
          アカウント
        </TabsTrigger>
        <TabsTrigger 
          value="notifications" 
          className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          <Bell className="h-4 w-4" />
          通知
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="p-6">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : profile ? (
          <ProfileSettingsForm initialProfile={profile} />
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            プロフィール情報が見つかりませんでした。再度お試しください。
          </div>
        )}
      </TabsContent>

      <TabsContent value="account" className="p-6">
        <AccountSettingsForm />
      </TabsContent>

      <TabsContent value="notifications" className="p-6">
        <NotificationSettingsForm />
      </TabsContent>
    </Tabs>
  );
}
