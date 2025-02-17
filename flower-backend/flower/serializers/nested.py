# flower/serializers/nested.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from communities.models import Community
from events.models import Event

User = get_user_model()

class NestedUserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="profile.display_name", read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'display_name', 'profile_image')

    def get_profile_image(self, obj):
        request = self.context.get('request')
        profile = getattr(obj, 'profile', None)
        if profile and profile.profile_image:
            image_url = profile.profile_image.url
            if request:
                return request.build_absolute_uri(image_url)
            return image_url
        return None
class NestedCommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ('id', 'name')

class NestedEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title')
