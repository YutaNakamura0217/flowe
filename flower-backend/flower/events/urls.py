from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventList.as_view(), name='event-list'),
    path(
        'communities/<int:community_id>/events/',
        views.CommunityEventList.as_view(),
        name='community-event-list',
    ),
    path('<int:pk>/', views.EventDetail.as_view(), name='event-detail'),
    path(
        '<int:event_id>/attendance/',
        views.EventAttendanceList.as_view(),
        name='event-attendance-list',
    ),
    path(
        '<int:event_id>/attendance/<int:user_id>/',
        views.EventAttendanceDetail.as_view(),
        name='event-attendance-detail',
    ),
    path(
        '<int:event_id>/comments/',
        views.EventCommentListCreate.as_view(),
        name='event-comment-list-create',
    ),
]
