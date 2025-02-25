"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Bell, Mail, Smartphone, Heart, MessageCircle, UserPlus, Calendar, Megaphone, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useNotificationSettings, NotificationSettings, defaultSettings } from "@/hooks/useNotificationSettings"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export function NotificationSettingsForm() {
  const { settings, loading, saving, error, fetchSettings, updateSettings } = useNotificationSettings();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(defaultSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      setLocalSettings(settings);
    }
  }, [loading, settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(localSettings);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const updateNotificationType = (type: keyof NotificationSettings['notification_types'], value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      notification_types: {
        ...prev.notification_types,
        [type]: value
      }
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          通知設定
        </CardTitle>
        <CardDescription>
          通知の受け取り方法や種類を設定します。設定はすぐに反映されます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {saveSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertTitle>保存完了</AlertTitle>
              <AlertDescription>
                通知設定が正常に保存されました。
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="delivery" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="delivery">通知方法</TabsTrigger>
              <TabsTrigger value="types">通知の種類</TabsTrigger>
            </TabsList>

            <TabsContent value="delivery" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="emailNotifications" className="text-sm font-medium">
                        メール通知
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        重要な通知をメールで受け取ります
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={localSettings.email_notifications} 
                    onCheckedChange={(checked) => setLocalSettings({...localSettings, email_notifications: checked})} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="pushNotifications" className="text-sm font-medium">
                        プッシュ通知
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        アプリからのプッシュ通知を受け取ります
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="pushNotifications" 
                    checked={localSettings.push_notifications} 
                    onCheckedChange={(checked) => setLocalSettings({...localSettings, push_notifications: checked})} 
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">通知の頻度</Label>
                  <RadioGroup 
                    value={localSettings.notification_frequency}
                    onValueChange={(value) => setLocalSettings({
                      ...localSettings, 
                      notification_frequency: value as NotificationSettings['notification_frequency']
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <Label htmlFor="immediate">即時（発生時すぐに通知）</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">1日1回（まとめて通知）</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">週1回（まとめて通知）</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="types" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    <div>
                      <Label htmlFor="likeNotifications" className="text-sm font-medium">
                        いいね
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        あなたの投稿にいいねがついたとき
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="likeNotifications" 
                    checked={localSettings.notification_types.like} 
                    onCheckedChange={(checked) => updateNotificationType('like', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="commentNotifications" className="text-sm font-medium">
                        コメント
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        あなたの投稿にコメントがついたとき
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="commentNotifications" 
                    checked={localSettings.notification_types.comment} 
                    onCheckedChange={(checked) => updateNotificationType('comment', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-green-500" />
                    <div>
                      <Label htmlFor="followNotifications" className="text-sm font-medium">
                        フォロー
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        新しいフォロワーがあなたをフォローしたとき
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="followNotifications" 
                    checked={localSettings.notification_types.follow} 
                    onCheckedChange={(checked) => updateNotificationType('follow', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <Label htmlFor="eventNotifications" className="text-sm font-medium">
                        イベントリマインダー
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        参加予定のイベントが近づいたとき
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="eventNotifications" 
                    checked={localSettings.notification_types.event_reminder} 
                    onCheckedChange={(checked) => updateNotificationType('event_reminder', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-amber-500" />
                    <div>
                      <Label htmlFor="announcementNotifications" className="text-sm font-medium">
                        お知らせ
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        システムからの重要なお知らせ
                      </p>
                    </div>
                  </div>
                  <Switch 
                    id="announcementNotifications" 
                    checked={localSettings.notification_types.announcement} 
                    onCheckedChange={(checked) => updateNotificationType('announcement', checked)} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setLocalSettings(settings)}>
          リセット
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </CardFooter>
    </Card>
  )
}
