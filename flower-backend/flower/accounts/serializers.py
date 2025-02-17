# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Follow
from posts.models import Post, Like

User = get_user_model()

class MyPageSerializer(serializers.Serializer):
    """
    マイページ用に必要な情報をまとめて返す。
    """
    # ユーザー基本情報
    id = serializers.IntegerField()
    username = serializers.CharField()
    display_name = serializers.CharField(allow_blank=True)
    bio = serializers.CharField(allow_blank=True)
    profile_image_url = serializers.CharField(allow_blank=True)
    cover_image_url = serializers.CharField(allow_blank=True)  # 追加

    # ユーザー統計情報
    posts_count = serializers.IntegerField()
    followers_count = serializers.IntegerField()
    following_count = serializers.IntegerField()
    joined_date = serializers.CharField()

    # 投稿・お気に入り・コミュニティなど
    posts = serializers.ListField()
    favorites = serializers.ListField()
    communities = serializers.ListField()

# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Follow

User = get_user_model()

class UserProfileOnlySerializer(serializers.ModelSerializer):
    """UserProfileモデルのbio, cover_image, profile_imageだけ返す"""
    class Meta:
        model = UserProfile
        fields = ['bio', 'cover_image', 'profile_image']

class UserDetailSerializer(serializers.ModelSerializer):
    """
    ユーザー詳細情報を返すシリアライザー
    (あなたの interface User に合わせたフィールド)
    """
    profile = UserProfileOnlySerializer(read_only=True)
    posts_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()  # 追加

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'profile',
            'posts_count',
            'followers_count',
            'following_count',
            'display_name',  # 追加
        ]

    def get_posts_count(self, obj):
        return obj.post_set.count()

    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()

    def get_display_name(self, obj):
        """UserProfile の display_name を取得する"""
        return obj.profile.display_name if obj.profile else ""
