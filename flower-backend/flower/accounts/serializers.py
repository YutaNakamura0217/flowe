# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Follow, Notification
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

class UserSerializer(serializers.ModelSerializer):
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
        profile = getattr(obj, 'profile', None) # obj.profile が存在しない場合は None を返す
        if profile:
            return profile.display_name
        else:
            return ""
    

class FollowSerializer(serializers.ModelSerializer):
    """フォロー関係をシリアライズする"""
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at'] # 必要に応じてフィールドを追加・変更
        read_only_fields = ['id', 'created_at'] # created_at は読み取り専用にするのが一般的

    # バリデーション (オプション): フォロー/フォロー解除のビジネスロジックをここに記述することも可能
    def validate(self, data):
        if data['follower'] == data['following']:
            raise serializers.ValidationError("You cannot follow yourself.")
        return data

class NotificationSerializer(serializers.ModelSerializer):
    """通知をシリアライズする"""
    sender_name = serializers.SerializerMethodField()
    content_preview = serializers.SerializerMethodField()
    sender_id = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'sender_name', 'sender_id', 
            'content_preview', 'is_read', 'created_at', 'post', 'event'
        ]
    
    def get_sender_name(self, obj):
        if obj.sender:
            return obj.sender.username
        return None
        
    def get_sender_id(self, obj):
        if obj.sender:
            return obj.sender.id
        return None
        
    def get_post(self, obj):
        if obj.post:
            return obj.post.id
        return None
        
    def get_event(self, obj):
        if obj.event:
            return obj.event.id
        return None
    
    def get_content_preview(self, obj):
        # 通知タイプに応じて適切なプレビューテキストを返す
        if obj.notification_type == 'like':
            return 'あなたの投稿にいいねしました'
        elif obj.notification_type == 'comment':
            return 'あなたの投稿にコメントしました'
        elif obj.notification_type == 'follow':
            return 'あなたをフォローしました'
        elif obj.notification_type == 'event_reminder':
            return 'イベントのリマインダー'
        elif obj.notification_type == 'announcement':
            return '運営からのお知らせ'
        return ''
