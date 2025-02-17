# flower/posts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostList.as_view(), name='post-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('<int:pk>/', views.PostDetail.as_view(), name='posts-detail'),
    path('<int:post_id>/comments/', views.CommentListCreate.as_view(), name='post-comments'),
    path('perquery/', views.PostListPerQueryView.as_view(), name='post-list-per-query'),
    path('<int:post_id>/like/', views.ToggleLikeAPIView.as_view(), name='post-like-toggle'),
    path('<int:user_id>/favorites/', views.UserFavoritesAPIView.as_view(), name='post-favorites'),
]