"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccountSettings, AccountSettings } from "@/hooks/useAccountSettings"
import { useAuth } from "@/contexts/AuthContext"
import { Mail, Lock, Globe, Shield, AlertCircle, User, Trash2 } from "lucide-react"

export function AccountSettingsForm() {
  const { user } = useAuth();
  const { saving, error, updateAccountSettings, deleteAccount } = useAccountSettings();
  
  const [settings, setSettings] = useState<AccountSettings>({
    email: user?.username || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
    language: "ja",
    timezone: "Asia/Tokyo",
    privacy_level: "public",
  });
  
  const [deletePassword, setDeletePassword] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        email: user.username || prev.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    // パスワードのバリデーション
    if (settings.new_password) {
      if (!settings.current_password) {
        setPasswordError("現在のパスワードを入力してください");
        return;
      }
      if (settings.new_password !== settings.confirm_password) {
        setPasswordError("新しいパスワードと確認用パスワードが一致しません");
        return;
      }
      if (settings.new_password.length < 8) {
        setPasswordError("パスワードは8文字以上である必要があります");
        return;
      }
    }
    
    const success = await updateAccountSettings(settings);
    if (success) {
      // パスワードフィールドをリセット
      setSettings(prev => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setPasswordError("アカウントを削除するには現在のパスワードを入力してください");
      return;
    }
    
    const success = await deleteAccount(deletePassword);
    if (success) {
      // アカウント削除後の処理はAuthContextで行われる想定
      // ここでは何もしない
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          アカウント設定
        </CardTitle>
        <CardDescription>
          アカウント情報やセキュリティ設定を管理します
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
                アカウント設定が正常に保存されました。
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">基本情報</TabsTrigger>
              <TabsTrigger value="security">セキュリティ</TabsTrigger>
              <TabsTrigger value="privacy">プライバシー</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="email" className="text-sm font-medium">
                      メールアドレス
                    </Label>
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settings.email} 
                    onChange={(e) => setSettings({...settings, email: e.target.value})} 
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    このメールアドレスはログインや通知に使用されます
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="language" className="text-sm font-medium">
                      言語
                    </Label>
                  </div>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => setSettings({...settings, language: value})}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="言語を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="timezone" className="text-sm font-medium">
                      タイムゾーン
                    </Label>
                  </div>
                  <Select 
                    value={settings.timezone} 
                    onValueChange={(value) => setSettings({...settings, timezone: value})}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="タイムゾーンを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">東京 (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">ニューヨーク (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">ロンドン (GMT+0)</SelectItem>
                      <SelectItem value="Asia/Singapore">シンガポール (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      現在のパスワード
                    </Label>
                  </div>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={settings.current_password}
                    onChange={(e) => setSettings({...settings, current_password: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    新しいパスワード
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={settings.new_password}
                    onChange={(e) => setSettings({...settings, new_password: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    8文字以上で、英字・数字を含めてください
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    新しいパスワード（確認）
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={settings.confirm_password}
                    onChange={(e) => setSettings({...settings, confirm_password: e.target.value})}
                  />
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>パスワードエラー</AlertTitle>
                    <AlertDescription>
                      {passwordError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <Label className="text-sm font-medium">プロフィールの公開範囲</Label>
                  </div>
                  <RadioGroup 
                    value={settings.privacy_level} 
                    onValueChange={(value) => setSettings({
                      ...settings, 
                      privacy_level: value as AccountSettings['privacy_level']
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">公開（誰でも閲覧可能）</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="followers" id="followers" />
                      <Label htmlFor="followers">フォロワーのみ（フォロワーだけが閲覧可能）</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">非公開（自分だけが閲覧可能）</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    アカウントの削除
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        アカウントを削除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                          この操作は取り消せません。すべての投稿、コメント、プロフィール情報が完全に削除されます。
                          <div className="mt-4 space-y-2">
                            <Label htmlFor="deletePassword" className="text-sm font-medium">
                              確認のため、現在のパスワードを入力してください
                            </Label>
                            <Input
                              id="deletePassword"
                              type="password"
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                            />
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteAccount();
                          }}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          削除する
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => {
          setSettings({
            email: user?.username || "",
            current_password: "",
            new_password: "",
            confirm_password: "",
            language: "ja",
            timezone: "Asia/Tokyo",
            privacy_level: "public",
          });
          setPasswordError(null);
        }}>
          リセット
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </CardFooter>
    </Card>
  )
}
