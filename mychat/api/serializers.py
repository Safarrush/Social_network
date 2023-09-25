from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from users.models import User, FriendRequest, Friends


class UserRegistrSerializer(UserCreateSerializer):

    class Meta:
        model = User
        fields = (
            'email',
            'id',
            'username',
            'first_name',
            'last_name',
            'password',
        )


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email',)


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        fields = (
            'id', 'username', 'email', 'first_name',
            'last_name', 'bio', 'role',
        )
        model = User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name',)


class MeSerializer(ProfileSerializer):

    class Meta(ProfileSerializer.Meta):
        read_only_fields = ('role',)


class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends
        fields = ('id', 'user_id_1', 'user_id_2',)


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ('id', 'sender', 'recipient',
                  'last_name', 'first_name', 'is_pending')
