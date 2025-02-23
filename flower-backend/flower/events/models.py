# events/models.py (修正例)
from django.db import models
from django.conf import settings
from communities.models import Community


class Event(models.Model):
    """イベント"""

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='organized_events',
        on_delete=models.CASCADE,
    )
    community = models.ForeignKey(
        Community, related_name='events', on_delete=models.CASCADE, null=True, blank=True
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    attendees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='attended_events',
        through='EventAttendance',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_community_only = models.BooleanField(
        default=False
    )  # ★ is_community_only フィールドを追加 ★

    def __str__(self):
        return self.title


class EventAttendance(models.Model):
    """イベント参加 (中間テーブル)"""

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    attended_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self):
        return f'{self.user.username} attends {self.event.title}'


class Comment(models.Model):
    """コメント"""

    event = models.ForeignKey(Event, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.event.title}'
