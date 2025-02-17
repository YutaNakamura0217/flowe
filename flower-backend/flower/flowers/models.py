from django.db import models
from posts.models import Post, Comment
from events.models import Event
from accounts.models import Follow
from django.conf import settings

class Flower(models.Model):
    """お花図鑑"""
    name = models.CharField(max_length=255, unique=True)
    scientific_name = models.CharField(max_length=255, blank=True)
    family_name = models.CharField(max_length=255, blank=True)
    origin = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    how_to_grow = models.TextField(blank=True)
    # image = models.ImageField(upload_to='flower_images/', null=True, blank=True)  # 削除
    flower_languages = models.ManyToManyField('FlowerLanguage', blank=True)

    def __str__(self):
        return self.name

class FlowerLanguage(models.Model):
    """花言葉"""
    language = models.CharField(max_length=255)
    meaning = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.language} ({self.meaning})"

class FlowerImage(models.Model):
    """花ごとの画像"""
    flower = models.ForeignKey(Flower, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='flower_images/')

    def __str__(self):
        return f"{self.flower.name} - Image {self.pk}"
