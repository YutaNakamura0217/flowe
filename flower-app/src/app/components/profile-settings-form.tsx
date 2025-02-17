"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Profile = {
  display_name?: string
  bio?: string
  profile_image_url?: string | null
  cover_image_url?: string | null
}

export function ProfileSettingsForm({ initialProfile }: { initialProfile: Profile }) {
  const [displayName, setDisplayName] = useState(initialProfile.display_name || "")
  const [bio, setBio] = useState(initialProfile.bio || "")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // FormDataに情報を追加
    const formData = new FormData()
    formData.append("display_name", displayName)
    formData.append("bio", bio)
    if (profileImage) {
      formData.append("profile_image", profileImage)
    }
    if (coverImage) {
      formData.append("cover_image", coverImage)
    }

    try {
      const res = await fetch("https://127.0.0.1:8000/api/accounts/update_profile/", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert("プロフィールが更新されました！")
      } else {
        alert("プロフィール更新エラー: " + JSON.stringify(data))
      }
    } catch (error) {
      console.error("プロフィール更新時のエラー:", error)
      alert("プロフィール更新に失敗しました")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              名前
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              自己紹介
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="profileImage" className="text-sm font-medium">
              プロフィール画像
            </label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setProfileImage(e.target.files[0])
                } else {
                  setProfileImage(null)
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="coverImage" className="text-sm font-medium">
              カバー画像
            </label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setCoverImage(e.target.files[0])
                } else {
                  setCoverImage(null)
                }
              }}
            />
          </div>
          <Button type="submit">保存</Button>
        </form>
      </CardContent>
    </Card>
  )
}
