from rest_framework import serializers
from django.conf import settings
from .models import Tweet, Comment
from . import services as likes_services
from users.models import User


MAX_LENGTH = settings.MAX_LENGTH
TWEET_ACTION_OPTIONS = settings.TWEET_ACTION_OPTIONS


class TweetActionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)

    def validate_actions(self, value):
        value = value.lower().strip()
        if not value in TWEET_ACTION_OPTIONS:
            raise serializers.ValidationError('Такой действия нет')
        return value


class TweetCreateSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    user = serializers.StringRelatedField(
        default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'likes', 'user',
                  'user_first_name', 'user_last_name']

    def get_likes(self, obj):
        return obj.likes.count()

    def validate_content(self, value):
        if len(value) > MAX_LENGTH:
            raise serializers.ValidationError('Слишком длинный текст')
        return value


class TweetSerializer(serializers.ModelSerializer):
    # likes = serializers.SerializerMethodField(read_only=True)
    # parent = TweetCreateSerializer(read_only=True)
    is_fan = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'is_fan',
                  'total_likes', 'user',
                  'user_first_name', 'user_last_name', 'timestamp']

    # def get_likes(self, obj):
        # return obj.likes.count()
    def get_is_fan(self, obj):
        user = self.context.get('request').user
        return likes_services.is_fan(obj, user)


class FanSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'full_name',)

    def get_full_name(self, obj):
        return obj.get_full_name()


class CommentReadSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class CommentWriteSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Comment
        fields = '__all__'
