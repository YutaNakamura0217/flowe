from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from events.models import Event, EventAttendance
from events.serializers import EventSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

class EventList(generics.ListAPIView):
    """
    イベント一覧を取得するAPIエンドポイント
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['community', 'is_community_only']
    ordering_fields = ['date', 'created_at']