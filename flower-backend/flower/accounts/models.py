# accounts/models.py
from django.db import models
from django.conf import settings
from posts.models import Post, Tag # Like, Commentは削除
from events.models import Event

# accounts/models.py
class UserProfile(models.Model):
    """ユーザープロフィール (Userモデルの拡張)"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    # 名前や表示名をプロフィール側に持たせたいなら追加
    display_name = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    is_public = models.BooleanField(default=True)

    # シンプルな画像フィールド例
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)  # 追加

    def __str__(self):
        return self.user.username



class Follow(models.Model):
    """フォロー関係"""
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="following", on_delete=models.CASCADE
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="followers", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")

    def __str__(self):
        return f"{self.follower} follows {self.following}"


class Report(models.Model):
    """通報"""
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="reports_sent", on_delete=models.CASCADE
    )
    reported_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="reports_received",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    reported_post = models.ForeignKey(
        Post, on_delete=models.CASCADE, null=True, blank=True
    )
    reported_comment = models.ForeignKey(
        "posts.Comment", on_delete=models.CASCADE, null=True, blank=True
    ) # postsアプリのCommentモデルを参照
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.reporter.username}"


class Notification(models.Model):
    """通知"""
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="notifications", on_delete=models.CASCADE
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="sent_notifications",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(
        "posts.Comment", on_delete=models.CASCADE, null=True, blank=True
    )  # postsアプリのCommentモデルを参照
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, null=True, blank=True
    )  # events app
    follow = models.ForeignKey(
        Follow, on_delete=models.CASCADE, null=True, blank=True
    )  # accounts.Follow
    NOTIFICATION_TYPES = (
        ("like", "いいね"),
        ("comment", "コメント"),
        ("follow", "フォロー"),
        ("event_reminder", "イベントリマインダー"),
        ("announcement", "運営からのお知らせ"),
    )
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notification_type} for {self.recipient.username}"