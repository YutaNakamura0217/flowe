from rest_framework import generics, permissions
from .models import Event, EventAttendance, Comment
from .serializers import EventSerializer, EventAttendanceSerializer, EventCommentSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from communities.models import CommunityMembership


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
        serializer.save(
            organizer=self.request.user, community_id=community_id, is_community_only=True
        )


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pk = self.kwargs['pk']
        print(f'Attempting to retrieve event with pk: {pk}')  # Debug print
        obj = super().get_object()
        print(f'Retrieved object: {obj}')  # Debug print
        return obj


class EventAttendanceList(generics.ListCreateAPIView):
    serializer_class = EventAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return EventAttendance.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs['event_id']
        # Check if the user is already attending
        if EventAttendance.objects.filter(
            event_id=event_id, user=self.request.user
        ).exists():
            return Response(
                {'detail': 'You are already attending this event.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event = Event.objects.get(pk=event_id)
        if event.is_community_only:
            if not event.community.members.filter(id=self.request.user.id).exists():
                return Response(
                    {
                        'detail': 'You are not a member of the community hosting this event.'
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        serializer.save(user=self.request.user, event_id=event_id)


class EventAttendanceDetail(generics.RetrieveDestroyAPIView):
    queryset = EventAttendance.objects.all()
    serializer_class = EventAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        event_id = self.kwargs['event_id']
        user_id = self.kwargs['user_id']
        return EventAttendance.objects.get(event_id=event_id, user_id=user_id)


class EventCommentListCreate(generics.ListCreateAPIView):
    """
    GET: 指定したイベントのコメント一覧を返す
    POST: 新規コメントを作成する
    """

    serializer_class = EventCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Comment.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        text = self.request.data.get('text')
        serializer.save(user=self.request.user, event=event, text=text)
