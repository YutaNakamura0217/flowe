"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettingsForm } from "@/components/profile-settings-form"
import { AccountSettingsForm } from "@/components/account-settings-form"
import { NotificationSettingsForm } from "@/components/notification-settings-form"

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://127.0.0.1:8000/api/accounts/profile/", {
          method: "GET",
          credentials: "include", // Cookieを送る
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile) // 期待する形式: { display_name, bio, profile_image_url }
        } else {
          console.error("Fetching profile failed:", res.status)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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
  )
}

