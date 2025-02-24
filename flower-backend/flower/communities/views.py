from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Community, CommunityMembership
from .serializers import CommunitySerializer, CommunityMembershipSerializer
from django.db import IntegrityError  # 追加
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination


class CommunityList(generics.ListCreateAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = PageNumberPagination  # Add pagination

    def perform_create(self, serializer):  # 新規作成時に実行
        serializer.save()

    def get_serializer_context(self):
        """serializer context に request を追加 (is_member 判定で使用)"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CommunityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # 読み取りは誰でも

    def get_serializer_context(self):  # get_serializer_context メソッドを追加
        """serializer context に request を追加 (is_member 判定で使用)"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CommunityMembershipList(generics.ListCreateAPIView):
    queryset = CommunityMembership.objects.all()
    serializer_class = CommunityMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]  # 認証済みユーザーのみ

    def perform_create(self, serializer):
        # community_id は URL から取得
        community_id = self.kwargs['pk']
        try:
            community = Community.objects.get(pk=community_id)
        except Community.DoesNotExist:
            return Response(
                {"detail": "Community not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # すでにメンバーシップが存在するか確認
        if CommunityMembership.objects.filter(user=self.request.user, community=community).exists():
            return Response(
                {"detail": "You are already a member of this community."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            serializer.save(user=self.request.user, community=community)
        except IntegrityError:  # 一意性制約違反の場合
            return Response(
                {"detail": "You are already a member of this community."},
                status=status.HTTP_400_BAD_REQUEST
            )


class CommunityMembershipDetail(generics.RetrieveDestroyAPIView):
    queryset = CommunityMembership.objects.all()
    serializer_class = CommunityMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]  # 認証済みユーザーのみ

    def get_object(self):
        # community_id と user_id (または request.user) でメンバーシップを特定
        community_id = self.kwargs['pk']  # Community の ID
        try:
            membership = CommunityMembership.objects.get(
                community_id=community_id, user=self.request.user
            )
            return membership
        except CommunityMembership.DoesNotExist:
            return Response(
                {"detail": "Membership not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if isinstance(instance, Response):  # get_object が Response を返した場合
            return instance
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class UserCommunityList(generics.ListAPIView):
    """
    指定された user_id に紐づくコミュニティ一覧を返す
    """
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        # Community.members は ManyToManyField なので、members__id でフィルタできます
        return Community.objects.filter(members__id=user_id)

class CommunityJoinLeave(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            community = Community.objects.get(pk=pk)
            membership, created = CommunityMembership.objects.get_or_create(
                user=request.user, community=community
            )
            if created:
                community.members.add(request.user)
                return Response({"detail": "Successfully joined the community."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "You are already a member of this community."}, status=status.HTTP_400_BAD_REQUEST)
        except Community.DoesNotExist:
            return Response({"detail": "Community not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            community = Community.objects.get(pk=pk)
            membership = CommunityMembership.objects.filter(user=request.user, community=community).first()
            if membership:
                membership.delete()
                community.members.remove(request.user)
                return Response({"detail": "Successfully left the community."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"detail": "You are not a member of this community."}, status=status.HTTP_400_BAD_REQUEST)
        except Community.DoesNotExist:
            return Response({"detail": "Community not found."}, status=status.HTTP_404_NOT_FOUND)
