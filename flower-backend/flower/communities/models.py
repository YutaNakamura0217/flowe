from django.db import models
from django.conf import settings  # settingsをインポート

# Create your models here.
# communities/models.py (コミュニティ関連)

class Community(models.Model):
    """コミュニティ"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='community/', null=True, blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='communities', through='CommunityMembership')
    created_at = models.DateTimeField(auto_now_add=True)
    is_regional = models.BooleanField(default=False)
    region = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class CommunityMembership(models.Model):
    """コミュニティメンバーシップ (中間テーブル)"""
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('community', 'user')

    def __str__(self):
        return f'{self.user.username} in {self.community.name}'