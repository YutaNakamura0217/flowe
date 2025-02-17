from rest_framework import serializers
from events.models import Event, EventAttendance
from serializers.nested import NestedUserSerializer, NestedCommunitySerializer

class EventSerializer(serializers.ModelSerializer):
    organizer = NestedUserSerializer(read_only=True)
    community = NestedCommunitySerializer(read_only=True)
    attendees_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            'id', 'organizer', 'community', 'title', 'description', 'date',
            'location', 'capacity', 'fee', 'created_at', 'attendees_count', 'is_community_only'
        )

    def get_attendees_count(self, obj):
        return EventAttendance.objects.filter(event=obj).count()
