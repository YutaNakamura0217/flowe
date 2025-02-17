"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NotificationSettingsForm() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [newPostNotifications, setNewPostNotifications] = useState(true)
  const [newCommentNotifications, setNewCommentNotifications] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここに実際の更新ロジックを実装します
    console.log("Updating notification settings:", {
      emailNotifications,
      pushNotifications,
      newPostNotifications,
      newCommentNotifications,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="emailNotifications" className="text-sm font-medium">
              メール通知
            </label>
            <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="pushNotifications" className="text-sm font-medium">
              プッシュ通知
            </label>
            <Switch id="pushNotifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="newPostNotifications" className="text-sm font-medium">
              新しい投稿の通知
            </label>
            <Switch
              id="newPostNotifications"
              checked={newPostNotifications}
              onCheckedChange={setNewPostNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="newCommentNotifications" className="text-sm font-medium">
              新しいコメントの通知
            </label>
            <Switch
              id="newCommentNotifications"
              checked={newCommentNotifications}
              onCheckedChange={setNewCommentNotifications}
            />
          </div>
          <Button type="submit">保存</Button>
        </form>
      </CardContent>
    </Card>
  )
}

