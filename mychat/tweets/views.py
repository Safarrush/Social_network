from django.shortcuts import render
from .models import Tweet, Comment
from .serializers import TweetSerializer, CommentReadSerializer, CommentWriteSerializer, TweetActionSerializer, TweetCreateSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import filters, status
from rest_framework.permissions import (SAFE_METHODS, AllowAny,
                                        IsAuthenticated)
from rest_framework import viewsets
from .mixins import LikedMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from .permissions import IsAuthorOrReadOnly

# Create your views here.


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    queryset = Tweet.objects.filter(id=tweet_id)
    if not queryset.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)
    queryset = queryset.filter(user=request.user)
    if not queryset.exists():
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    obj = queryset.first()
    obj.delete()
    return Response(status=status.HTTP_200_OK)


class TweetViewSet(LikedMixin, viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            user=user,
            user_first_name=user.first_name,
            user_last_name=user.last_name
        )

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated],
        url_path='my'
    )
    def get_user_tweets(self, request):
        user = self.request.user
        tweets = Tweet.objects.filter(user=user)
        serializer = self.get_serializer(tweets, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()

    def get_queryset(self):
        res = super().get_queryset()
        print(f"self.kwargs.get('tweet_id'): {self.kwargs.get('tweet_id')}")
        post_id = self.kwargs.get('tweet_id')
        return res.filter(post__id=post_id)

    def perform_create(self, serializer):
        tweet_id = self.kwargs.get('tweet_id')
        serializer.save(post_id=tweet_id)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return CommentWriteSerializer
        return CommentReadSerializer

    def get_permissions(self):
        if self.action in ('create',):
            self.permission_classes = (IsAuthenticated,)
        elif self.action in ('update', 'partial_update', 'destroy',):
            self.permission_classes = (IsAuthorOrReadOnly,)
        else:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
