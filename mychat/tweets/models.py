from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User
from django.contrib.contenttypes.fields import GenericRelation


class TweetLike(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='likes')
    # timestamp = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')


class Tweet(models.Model):
    user = models.ForeignKey(User, to_field='username',
                             on_delete=models.CASCADE, null=True)
    content = models.TextField(blank=True, null=True)
    likes = GenericRelation(TweetLike)
    timestamp = models.DateTimeField(
        auto_now_add=True)
    user_first_name = models.CharField(max_length=30, blank=True)
    user_last_name = models.CharField(max_length=30, blank=True)
    # image = models.FileField(upload_to='images/', blank=True)

    class Meta:
        ordering = ['-id']

    @property
    def total_likes(self):
        return self.likes.count()


class Comment(models.Model):
    post = models.ForeignKey(
        Tweet, related_name='comments', on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(
        User,
        related_name='post_comments',
        null=True,
        on_delete=models.SET_NULL,
    )
    body = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'{self.body[:20]} by {self.author.username}'
