from rest_framework import generics, permissions
from .models import Event, EventAttendance
from .serializers import EventSerializer, EventAttendanceSerializer
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status

class EventList(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(is_community_only=False)

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class CommunityEventList(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        community_id = self.kwargs['community_id']
        return Event.objects.filter(community_id=community_id, is_community_only=True)

    def perform_create(self, serializer):
        community_id = self.kwargs['community_id']
        serializer.save(organizer=self.request.user, community_id=community_id, is_community_only=True)

class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

class EventAttendanceList(generics.ListCreateAPIView):
    serializer_class = EventAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return EventAttendance.objects.filter(event_id=event_id)
    
    def perform_create(self, serializer):
        event_id = self.kwargs['event_id']
        # Check if the user is already attending
        if EventAttendance.objects.filter(event_id=event_id, user=self.request.user).exists():
            return Response({"detail": "You are already attending this event."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=self.request.user, event_id=event_id)

class EventAttendanceDetail(generics.RetrieveDestroyAPIView):
    queryset = EventAttendance.objects.all()
    serializer_class = EventAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        event_id = self.kwargs['event_id']
        user_id = self.kwargs['user_id']
        return EventAttendance.objects.get(event_id=event_id, user_id=user_id)
