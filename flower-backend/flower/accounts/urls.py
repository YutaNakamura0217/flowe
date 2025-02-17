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
]
