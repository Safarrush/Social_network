from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, GenericAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from users.models import User, FriendRequest, Friends
from rest_framework import generics
from djoser.views import UserViewSet
from api.serializers import FriendRequestSerializer, FriendsSerializer, UserSerializer, UserRegistrSerializer, ProfileSerializer, MeSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from api.utils import BaseExcludePutMethodViewSet
from rest_framework.decorators import action, api_view, permission_classes
from django.db.models import Q
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError


class CustomUserViewSet(UserViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegistrSerializer


class UserViewSet(BaseExcludePutMethodViewSet):
    queryset = User.objects.all()
    lookup_field = 'username'
    serializer_class = ProfileSerializer
    search_fields = ('=username',)
    permission_classes = (IsAuthenticated,)

    @action(
        methods=('get', 'patch'),
        detail=False,
        url_path='me',
        permission_classes=(IsAuthenticated,),
        serializer_class=MeSerializer
    )
    def users_profile(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request):
        # Исключите текущего пользователя из списка всех пользователей
        queryset = self.queryset.exclude(id=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileView(APIView):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        user_friends = User.objects.filter(
            Q(user_id_1__user_id_2=pk) | Q(user_id_2__user_id_1=pk)
        )
        user_profile = get_object_or_404(User, id=pk).username
        own_user = self.request.user
        if user_profile == own_user:
            return Response(data={"message": "Это ваша страница"}, status=status.HTTP_200_OK)
        user_friends_serializer = UserSerializer(user_friends, many=True)
        friend_status = "Ничего"
        if user_profile == str(own_user):
            friend_status = "Это ваша страница"
        elif Friends.objects.filter(
            (Q(user_id_1=own_user.id) | Q(user_id_1=pk))
            & (Q(user_id_2=own_user.id) | Q(user_id_2=pk))
        ).exists():
            friend_status = "Уже друзья"
        elif own_user.sender.filter(recipient=pk).exists():
            friend_status = "Исходящая заявка"
        elif own_user.recipient.filter(sender=pk).exists():
            friend_status = "Входящая заявка"
        data = {
            "id": pk,
            "user_profile": user_profile,
            "friend_status": friend_status,
            "user_friends": user_friends_serializer.data,
        }
        return Response(data=data, status=status.HTTP_200_OK)


class UserFriendView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.request.user.id
        friends = User.objects.filter(
            Q(user_id_1__user_id_2=user_id) | Q(user_id_2__user_id_1=user_id)
        )
        return friends


class RemoveFriendView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        pk = kwargs['pk']
        sender = User.objects.get(id=request.user.id).id
        recipient = pk
        friend_request = FriendRequest.objects.filter(
            sender_id=recipient, recipient_id=sender
        ).first()
        remove_entry = Friends.objects.filter(
            (Q(user_id_1=sender) | Q(user_id_1=recipient))
            & (Q(user_id_2=sender) | Q(user_id_1=sender))
        )
        remove_entry.delete()
        data = {'sender_id': recipient, 'recipient_id': sender}
        serializer = FriendRequestSerilizer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if friend_request:
            friend_request.is_pending = False
            friend_request.delete()
        return Response(status=status.HTTP_200_OK)


class SendFriendRequestView(generics.CreateAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        user = self.request.user
        recipient_id = self.kwargs['pk']
        sender = User.objects.get(id=user.id)
        recipient = User.objects.get(id=recipient_id)
        if sender == recipient:
            raise ValidationError({"message": "Это ты"})
        if Friends.objects.filter(
            (Q(user_id_1=sender, user_id_2=recipient) |
             Q(user_id_1=recipient, user_id_2=sender))
        ).exists():
            raise ValidationError({"message": "Пользователи уже друзья"})
        if FriendRequest.objects.filter(sender=user, recipient=recipient, is_pending=True).exists():
            raise ValidationError({"message": "Заявка уже отправлена"})
        else:
            serializer.save(sender_id=self.request.user.id,
                            recipient_id=self.kwargs['pk'], first_name=user.first_name, last_name=user.last_name, is_pending=True)


class IncomingRequestsView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        incoming = FriendRequest.objects.filter(recipient=self.request.user.id)
        return incoming


class OutcomingRequestsView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        outcoming = FriendRequest.objects.filter(sender=self.request.user.id)
        return outcoming


class AcceptFriendRequestView(generics.CreateAPIView):
    serializer_class = FriendsSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        friend_request = FriendRequest.objects.filter(
            sender_id=self.kwargs["pk"]
        ).first()

        friend_request.is_pending = False
        friend_request.save()
        serializer.save(
            user_id_1=friend_request.sender, user_id_2=friend_request.recipient
        )
        # friend_request.delete()


class RemoveFriendRequestView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        pk = kwargs["pk"]
        recipient = pk
        sender = User.objects.get(id=request.user.id).id
        remove_entry = FriendRequest.objects.filter(
            Q(sender_id=recipient) & Q(recipient_id=sender)
        )
        remove_entry.delete()
        return Response(status=status.HTTP_200_OK)


class CanceleFriendRequestView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        pk = kwargs["pk"]
        recipient = pk
        sender = User.objects.get(id=request.user.id).id
        remove_entry = FriendRequest.objects.filter(
            Q(sender_id=sender) & Q(recipient_id=recipient)
        )
        remove_entry.delete()
        return Response(status=status.HTTP_200_OK)
