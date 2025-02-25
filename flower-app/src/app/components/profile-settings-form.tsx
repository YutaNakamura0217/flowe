// src/components/profile-settings-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { AlertCircle, User, Image, FileText, Camera } from "lucide-react";

type Profile = {
  display_name?: string;
  bio?: string;
  profile_image_url?: string | null;
  cover_image_url?: string | null;
};

export function ProfileSettingsForm({ initialProfile }: { initialProfile: Profile }) {
  const [displayName, setDisplayName] = useState(initialProfile.display_name || "");
  const [bio, setBio] = useState(initialProfile.bio || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(initialProfile.profile_image_url || null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialProfile.cover_image_url || null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { updateProfile, isLoading, error } = useUpdateProfile();

  // プレビュー画像の更新
  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    }

    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(coverImage);
    }
  }, [profileImage, coverImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        displayName,
        bio,
        profileImage,
        coverImage,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("プロフィール更新時のエラー:", err);
    }
  };

  const handleReset = () => {
    setDisplayName(initialProfile.display_name || "");
    setBio(initialProfile.bio || "");
    setProfileImage(null);
    setCoverImage(null);
    setProfileImagePreview(initialProfile.profile_image_url || null);
    setCoverImagePreview(initialProfile.cover_image_url || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          プロフィール設定
        </CardTitle>
        <CardDescription>
          あなたのプロフィール情報を編集します。他のユーザーに表示される情報です。
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
                プロフィールが正常に更新されました。
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <Label htmlFor="displayName" className="text-sm font-medium">
                  名前
                </Label>
              </div>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="あなたの表示名"
              />
              <p className="text-xs text-muted-foreground">
                他のユーザーに表示される名前です
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <Label htmlFor="bio" className="text-sm font-medium">
                  自己紹介
                </Label>
              </div>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="あなた自身について簡単に紹介してください"
              />
              <p className="text-xs text-muted-foreground">
                あなたの趣味や興味、好きな花などを書いてみましょう
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-gray-500" />
                <Label htmlFor="profileImage" className="text-sm font-medium">
                  プロフィール画像
                </Label>
              </div>
              
              {profileImagePreview && (
                <div className="mb-2">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                    <img 
                      src={profileImagePreview} 
                      alt="プロフィールプレビュー" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setProfileImage(e.target.files[0]);
                  } else {
                    setProfileImage(null);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                推奨サイズ: 400x400ピクセル、最大2MB
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-gray-500" />
                <Label htmlFor="coverImage" className="text-sm font-medium">
                  カバー画像
                </Label>
              </div>
              
              {coverImagePreview && (
                <div className="mb-2">
                  <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                    <img 
                      src={coverImagePreview} 
                      alt="カバー画像プレビュー" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setCoverImage(e.target.files[0]);
                  } else {
                    setCoverImage(null);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                推奨サイズ: 1200x400ピクセル、最大5MB
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={handleReset}>
          リセット
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </CardFooter>
    </Card>
  );
}
