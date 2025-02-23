# accounts/views.py
import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from .serializers import MyPageSerializer
from posts.models import Post
from communities.models import Community
from .models import Follow
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Follow, Notification # Notification をインポート
from .serializers import FollowSerializer # FollowSerializer をインポート
User = get_user_model()


# views.py
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    # get_token(request) を呼ぶと、Djangoが 'csrftoken' クッキーをセットする
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': '無効な JSON'}, status=400)

        email = data.get('email')
        password1 = data.get('password1')
        password2 = data.get('password2')

        if not email or not password1 or not password2:
            return JsonResponse({'success': False, 'error': 'メールアドレスとパスワードは必須です'}, status=400)

        username = email
        form = UserCreationForm({
            'username': username,
            'password1': password1,
            'password2': password2,
        })

        if form.is_valid():
            user = form.save(commit=False)
            user.email = email
            user.save()
            auth_user = authenticate(username=username, password=password1)
            if auth_user:
                login(request, auth_user)
                return JsonResponse({'success': True, 'message': 'サインアップ成功'})
            else:
                return JsonResponse({'success': False, 'error': '認証に失敗しました'}, status=400)
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': '無効なJSON'}, status=400)
        
        username = data.get('email')  
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'success': False, 'error': 'ユーザー名（メールアドレス）とパスワードは必須です'}, status=400)
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'ログイン成功'})
        else:
            return JsonResponse({'success': False, 'error': '認証に失敗しました'}, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
@login_required
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True, 'message': 'ログアウト成功'})
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
@login_required
def update_profile(request):
    if request.method == 'POST':
        profile = request.user.profile
        display_name = request.POST.get('display_name', '')
        bio = request.POST.get('bio', '')
        profile_image = request.FILES.get('profile_image', None)
        cover_image = request.FILES.get('cover_image', None)  # 追加

        if display_name:
            profile.display_name = display_name
        if bio is not None:
            profile.bio = bio
        if profile_image is not None:
            profile.profile_image = profile_image
        if cover_image is not None:
            profile.cover_image = cover_image  # 追加

        profile.save()
        return JsonResponse({'success': True, 'message': 'プロフィールを更新しました'})
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
@login_required
def get_profile(request):
    if request.method == 'GET':
        profile = request.user.profile

        image_url = None
        if profile.profile_image:
            image_url = request.build_absolute_uri(profile.profile_image.url)

        data = {
            'display_name': profile.display_name,
            'bio': profile.bio,
            'profile_image_url': image_url,
        }
        return JsonResponse({'success': True, 'profile': data})
    else:
        return HttpResponseNotAllowed(['GET'])


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mypage_view(request):
    """
    ログイン中のユーザーのマイページ情報をまとめて返す
    """
    user = request.user
    profile = user.profile

    # フォロー中ユーザー数
    following_count = Follow.objects.filter(follower=user).count()
    # フォロワー数
    followers_count = Follow.objects.filter(following=user).count()

    # ユーザーの投稿を全件取得（作成日時の降順でソート）
    user_posts = Post.objects.filter(user=user).order_by('-created_at')
    posts_count = user_posts.count()

    post_list = []
    for p in user_posts:
        post_list.append({
            "id": p.id,
            "image_url": request.build_absolute_uri(p.image_url.url) if p.image_url else None,
            "likes": p.post_likes.count(),
            "comments": p.post_comments.count(),
        })

    # joined_date は User モデルの date_joined と仮定
    joined_date = user.date_joined.strftime("%Y-%m-%d")

    # お気に入り (Like した投稿) と仮定（サンプルとして6件取得）
    favorite_posts = Post.objects.filter(post_likes__user=user).distinct()
    favorites_list = []
    for fp in favorite_posts:
        image_url = fp.image_url.url if fp.image_url else None
        absolute_image_url = request.build_absolute_uri(image_url) if image_url else None

        favorites_list.append({
            "id": fp.id,
            "image_url": absolute_image_url,
            "likes": fp.post_likes.count(),
            "comments": fp.post_comments.count(),
        })
    # 所属コミュニティ (CommunityモデルにManyToManyがある前提 or 何らかの関係)
    # 今回は単純化し、コミュニティ全件をダミー取得
    user_communities = Community.objects.all()[:4]
    communities_list = []
    for c in user_communities:
        communities_list.append({
            "id": c.id,
            "name": c.name,
            "memberCount": 123,
            "cover_image": None,
        })

    # 組み立て
    data = {
        "id": user.id,
        "username": user.username,
        "display_name": profile.display_name,
        "bio": profile.bio,
        "profile_image_url": request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else "",
        "cover_image_url": request.build_absolute_uri(profile.cover_image.url) if profile.cover_image else "",
        "posts_count": posts_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "joined_date": joined_date,
        "posts": post_list,
        "favorites": favorites_list,
        "communities": communities_list,
    }

    serializer = MyPageSerializer(data)
    return Response(serializer.data)

# accounts/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # or IsAuthenticatedなど適宜
def user_detail_view(request, user_id):
    """
    指定したユーザーIDの詳細情報を返す。
    """
    User = get_user_model()
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user, context={'request': request})
    return Response(serializer.data)


class FollowToggleView(generics.GenericAPIView):
    """
    フォロー/フォロー解除APIビュー
    """
    permission_classes = [permissions.IsAuthenticated] # 認証済ユーザーのみアクセス可能

    def post(self, request, user_id):
        """
        POSTリクエストでフォロー/フォロー解除を実行
        """
        try:
            following_user = User.objects.get(pk=user_id) # フォロー/フォロー解除対象のユーザーを取得
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        if request.user.id == user_id: # 自分自身をフォロー/フォロー解除しようとした場合
            return Response({"error": "You cannot follow/unfollow yourself."}, status=400)

        follow_relation = Follow.objects.filter(
            follower=request.user, following=following_user
        )

        if follow_relation.exists():
            # フォロー済みの場合、フォロー解除
            follow_relation.delete()
            return Response({"status": "unfollowed"}) # フォロー解除成功のレスポンス
        else:
            # 未フォローの場合、フォロー
            Follow.objects.create(follower=request.user, following=following_user)

            # 通知を作成 (オプション)
            Notification.objects.create(
                recipient=following_user,
                sender=request.user,
                notification_type='follow',
                follow=Follow.objects.filter(follower=request.user, following=following_user).first() # 作成された Follow インスタンスを紐付け
            )

            return Response({"status": "followed"}) # フォロー成功のレスポンス
        
class FollowStatusView(generics.RetrieveAPIView): # RetrieveAPIView を使用 (GETリクエスト用)
  """
  フォロー状態取得APIビュー
  """
  permission_classes = [permissions.IsAuthenticated] # 認証済ユーザーのみアクセス可能
  serializer_class = serializers.Serializer # 特にシリアライズするデータはないので、Serializer を使用

  def retrieve(self, request, user_id, *args, **kwargs):
    try:
      following_user = User.objects.get(pk=user_id) # フォロー状態を確認したいユーザー
    except User.DoesNotExist:
      return Response({"error": "User not found."}, status=404)

    is_following = Follow.objects.filter(
      follower=request.user, following=following_user
    ).exists()

    return Response({"is_following": is_following}) # フォロー状態 (真偽値) を返す
