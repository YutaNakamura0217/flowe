# flower/communities/urls.py
from django.urls import path
from . import views

urlpatterns = [
path('', views.CommunityList.as_view(), name='community-list'),
path('<int:pk>/', views.CommunityDetail.as_view(), name='community-detail'),
path('<int:pk>/members/', views.CommunityMembershipList.as_view(), name='community-membership-list'),
path('<int:pk>/members/me/', views.CommunityMembershipDetail.as_view(), name='community-membership-detail'),
path('user/<int:user_id>/communities/', views.UserCommunityList.as_view(), name='user-community-list'),
]