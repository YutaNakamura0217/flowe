from rest_framework import serializers
from communities.models import Community, CommunityMembership
from serializers.nested import NestedEventSerializer, NestedUserSerializer
from posts.serializers import PostSerializer

class CommunityMembershipSerializer(serializers.ModelSerializer):
    user = NestedUserSerializer(read_only=True)
    
    class Meta:
        model = CommunityMembership
        fields = ('user', 'joined_at')

class CommunitySerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    members = CommunityMembershipSerializer(source='communitymembership_set', many=True, read_only=True)
    posts = PostSerializer(many=True, read_only=True)
    events = NestedEventSerializer(many=True, read_only=True)  # 簡易版イベントシリアライザを利用

    class Meta:
        model = Community
        fields = (
            'id', 'name', 'description', 'cover_image', 'members_count', 'created_at',
            'is_regional', 'is_member', 'members', 'posts', 'events'
        )
        read_only_fields = ('id', 'created_at')

    def get_cover_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_members_count(self, obj):
        return obj.members.count()

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # CommunityMembership を直接インポートするか、必要なら再度ネスト用を使う
            from communities.models import CommunityMembership
            return CommunityMembership.objects.filter(community=obj, user=request.user).exists()
        return None
