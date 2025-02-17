from rest_framework import serializers
from .models import Post, Tag, Comment
from django.contrib.auth import get_user_model
from serializers.nested import NestedUserSerializer
from accounts.models import UserProfile
from communities.models import Community

User = get_user_model()

class TagCreateSlugRelatedField(serializers.SlugRelatedField):
    """
    入力されたタグ名が既存になければ作成する SlugRelatedField
    """
    def to_internal_value(self, data):
        # queryset は self.get_queryset() で取得可
        queryset = self.get_queryset()
        slug_field = self.slug_field
        
        try:
            # すでに存在するタグを取得
            return queryset.get(**{slug_field: data})
        except queryset.model.DoesNotExist:
            # 存在しなければ新規作成
            return queryset.create(**{slug_field: data})

class PostSerializer(serializers.ModelSerializer):
    """
    リスト用・簡易用の投稿シリアライザ。
    image_urlフィールドのみで画像アップロードと表示（絶対URL）を扱う
    """
    user = NestedUserSerializer(read_only=True)
    
    # 画像アップロード・書き込み用、GET時はto_representationで絶対URLに変換する
    image_url = serializers.ImageField(required=False, allow_null=True)
    
    tags = TagCreateSlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Tag.objects.all(),
        required=False,
    )
    community = serializers.PrimaryKeyRelatedField(
        queryset=Community.objects.all(),
        required=False
    )

    class Meta:
        model = Post
        fields = (
            'id', 'user',
            'image_url',    # 画像アップロードおよび表示用
            'caption', 'likes', 'comments',
            'created_at', 'updated_at', 'tags', 'variety_name',
            'location', 'public_status', 'community'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'likes', 'comments')

    def to_representation(self, instance):
        """GET時に image_url を絶対URLに変換して返す"""
        rep = super().to_representation(instance)
        request = self.context.get('request', None)
        image_url = rep.get('image_url')
        if image_url and request:
            rep['image_url'] = request.build_absolute_uri(image_url)
        return rep

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags_data)
        return post

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        
        # 画像アップロード・更新
        if 'image_url' in validated_data:
            instance.image_url = validated_data.get('image_url')
        
        instance.caption = validated_data.get('caption', instance.caption)
        instance.variety_name = validated_data.get('variety_name', instance.variety_name)
        instance.location = validated_data.get('location', instance.location)
        instance.public_status = validated_data.get('public_status', instance.public_status)
        instance.community = validated_data.get('community', instance.community)
        instance.save()

        if tags_data is not None:
            instance.tags.set(tags_data)
        return instance




class CommentSerializer(serializers.ModelSerializer):
    user = NestedUserSerializer(read_only=True)

    class Meta:
        model = Comment
        # 必要に応じて表示するフィールドを調整
        fields = ['id', 'user', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']



class ProfileSerializer(serializers.ModelSerializer):
    """ユーザーのプロフィール情報用シリアライザ"""
    class Meta:
        model = UserProfile
        fields = ("bio", "cover_image", "profile_image")


class UserDetailSerializer(serializers.ModelSerializer):
    """
    ユーザー詳細情報用シリアライザ
    - profile: プロフィール
    - posts_count, followers_count, following_count: 数え上げたい場合
    """
    profile = ProfileSerializer(read_only=True)
    posts_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "profile",
            "posts_count",
            "followers_count",
            "following_count",
        )
        read_only_fields = (
            "id",
            "username",
            "email",
        )

    def get_posts_count(self, obj):
        # ユーザーに関連するPostの件数を数える例
        return obj.post_set.count()

    def get_followers_count(self, obj):
        # ユーザーのフォロワー数を数える例
        # 実際のフォローモデルに合わせて実装してください
        # 例: return obj.followers.count()
        return 0

    def get_following_count(self, obj):
        # ユーザーがフォローしている数を数える例
        # 例: return obj.following.count()
        return 0
    

class DetailedPostSerializer(serializers.ModelSerializer):
    # ユーザー詳細版をネスト
    user = UserDetailSerializer(read_only=True)

    # タグを文字列としてリスト化
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )

    # いいね数、コメント数をSerializerMethodFieldで集計
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id',
            'user',
            'image_url',
            'caption',
            'likes',
            'comments',
            'created_at',
            'updated_at',
            'tags',
            'variety_name',
            'location',
            'public_status',
        )
        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
            'likes',
            'comments',
        )

    def get_likes(self, obj):
        """Likeモデル (post_likes) の関連レコード数を返す"""
        return obj.post_likes.count()

    def get_comments(self, obj):
        """Commentモデル (post_comments) の関連レコード数を返す"""
        return obj.post_comments.count()