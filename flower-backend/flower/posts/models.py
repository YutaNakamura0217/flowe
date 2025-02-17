# posts/models.py
from django.db import models
from communities.models import Community # communitiesアプリの Community モデルをインポート
from django.conf import settings
from django.contrib.auth import get_user_model

def get_default_user():
    """デフォルトのユーザーを取得または作成"""
    user, created = get_user_model().objects.get_or_create(
        pk=1, defaults={"username": "admin", "is_staff": True, "is_superuser": True}
    )
    return user.pk


class Like(models.Model):
    """いいね"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="likes", on_delete=models.CASCADE
    )
    post = models.ForeignKey(
        "Post", related_name="post_likes", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")

    def __str__(self):
        return f"{self.user.username} likes {self.post.id}"


class Comment(models.Model):
    """コメント"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="user_comments", on_delete=models.CASCADE
    )
    post = models.ForeignKey(
        "Post", related_name="post_comments", on_delete=models.CASCADE
    )
    text = models.TextField(max_length=500)
    parent = models.ForeignKey(
        "self", null=True, blank=True, related_name="replies", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on Post {self.post.id}"


class Tag(models.Model):
    """投稿タグ"""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=get_default_user
    )
    image_url = models.ImageField(upload_to='posts/', null=True, blank=True)
    caption = models.CharField(max_length=200)
    likes = models.IntegerField(default=0)  # likes, commentsはLike, Commentモデルで管理するので不要
    comments = models.IntegerField(default=0) # likes, commentsはLike, Commentモデルで管理するので不要
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True) # tagsを通常フィールドとして定義
    variety_name = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    public_status = models.CharField(
        max_length=20,
        choices=(
            ("public", "全体公開"),
            ("followers_only", "フォロワーのみ"),
            ("private", "非公開"),
        ),
        default="public",
    )
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts', null=True) # ★ ForeignKey を追加、related_name を指定 ★


    def __str__(self):
        return self.caption