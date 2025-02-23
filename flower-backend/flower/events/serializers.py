from rest_framework import serializers
from .models import Event, EventAttendance
from accounts.serializers import UserSerializer
from communities.serializers import CommunitySerializer
from communities.models import Community

class EventAttendanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EventAttendance
        fields = ['user', 'attended_at']

class EventSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    community = CommunitySerializer(read_only=True)
    attendees = UserSerializer(many=True, read_only=True)
    attendance = EventAttendanceSerializer(source='eventattendance_set', many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'organizer', 'community', 'title', 'description', 'date', 'location', 'capacity', 'fee', 'attendees', 'created_at', 'is_community_only', 'attendance']

class EventCreateSerializer(serializers.ModelSerializer):
    community = serializers.PrimaryKeyRelatedField(queryset=Community.objects.all(), required=False)
    organizer = UserSerializer(read_only=True)
    attendees = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'organizer', 'community', 'title', 'description', 'date', 'location', 'capacity', 'fee', 'attendees', 'created_at', 'is_community_only']
