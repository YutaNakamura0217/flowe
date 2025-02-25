# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('profile/', views.get_profile, name='profile'),
    path('mypage/',views.mypage_view, name='mypage'),
    path('csrf/', views.get_csrf_token),
    path('users/<int:user_id>/', views.user_detail_view, name='user-detail'), 
    path('users/<int:user_id>/follow/', views.FollowToggleView.as_view(), name='follow_toggle'), 
    path('users/<int:user_id>/follow/status/', views.FollowStatusView.as_view(), name='follow_status'),
    path('users/<int:user_id>/followers/', views.user_followers, name='user_followers'),
    path('users/<int:user_id>/following/', views.user_following, name='user_following'),
    path('notifications/', views.notifications_list, name='notifications_list'),
    path('notifications/mark-read/', views.mark_notification_read, name='mark_all_notifications_read'),
    path('notifications/<int:notification_id>/mark-read/', views.mark_notification_read, name='mark_notification_read'),
]
