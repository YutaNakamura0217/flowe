from rest_framework import generics, permissions,views  # permissions を追加
from .models import Post, Comment, Like
from .serializers import PostSerializer,DetailedPostSerializer
from django.contrib.auth import get_user_model
from serializers.nested import NestedUserSerializer as UserSerializer
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status, permissions
User = get_user_model()


class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # 認証済みユーザーのみ作成可能、読み取りは誰でもOK

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `user` query parameter in the URL.
        """
        queryset = Post.objects.all()
        user_id = self.request.query_params.get('user')
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset

    def perform_create(self, serializer):
        print(self.request.data)  # リクエストデータを出力 (デバッグ用)
        try:
            serializer.save(user=self.request.user)
        except ValidationError as e:
            print(e.detail)  # バリデーションエラーの詳細を出力
            raise  # 例外を再送出してクライアントにエラーを返す


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # 読み取りは誰でも

class PostDetail(generics.RetrieveAPIView):
    """
    指定した投稿IDの詳細を返す
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CommentListCreate(generics.ListCreateAPIView):
    """
    GET: 指定した投稿のコメント一覧を返す
    POST: 新規コメントを作成する
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # URL の kwargs から post_id を取得して、その投稿のコメントを返す
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        # リクエストボディで送られてくるキーは "content" としているので、それを text にマッピング
        text = self.request.data.get("text")
        serializer.save(user=self.request.user, post=post, text=text)

class PostListPerQueryView(generics.ListAPIView):
    """
    GET: （クエリパラメータによる）投稿一覧取得
         例: /api/posts/?user=1 => ユーザーID=1の投稿を時系列降順で
    """
    serializer_class = DetailedPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # まずは全投稿を取得して、作成日時の降順に並び替える
        queryset = Post.objects.all().order_by('-created_at')
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: 投稿詳細取得
    PUT/PATCH: 投稿の更新（フロントから送られてきたデータを反映）
    DELETE: 投稿の削除
    """
    queryset = Post.objects.all()
    serializer_class = DetailedPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        # 例: 更新時の処理に何か独自ロジックがあれば追加
        serializer.save()

    def perform_destroy(self, instance):
        # 例: 削除時の処理に何か独自ロジックがあれば追加
        instance.delete()


class ToggleLikeAPIView(views.APIView):
    """
    POSTリクエストで「いいね」をトグルするView:
      - まだ「いいね」していなければ新規作成
      - 既に「いいね」済みなら削除して解除
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        user = request.user
        
        # get_or_create で (user, post) の組合せが既存か判定
        like_obj, created = Like.objects.get_or_create(user=user, post=post)
        
        if created:
            # 新規にいいねが作成された場合
            message = "いいねしました"
        else:
            # 既に存在していた場合 => 削除(いいね解除)する
            like_obj.delete()
            message = "いいねを解除しました"
        
        post.likes = post.post_likes.count()
        post.save()

        return Response({"message": message,"likes_count": post.likes,}, status=status.HTTP_200_OK)
    


class UserFavoritesAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        print("UserFavoritesAPIView.get_serializer_context() - Context:", context) # ログ出力
        return context

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(User, pk=user_id)
        return Post.objects.filter(post_likes__user=user)