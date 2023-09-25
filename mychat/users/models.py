from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation

from .validators import validate_username

USER = settings.AUTH_USER_MODEL
MAX_LENGTH = 254


class User(AbstractUser):
    username = models.CharField(
        blank=True,
        max_length=150,
        unique=True,
        validators=[validate_username],
        verbose_name='Уникальный юзернейм',
        help_text='Имя пользователя'
    )
    email = models.EmailField(
        verbose_name="Email",
        max_length=MAX_LENGTH,
        unique=True,
        help_text='Адрес электронной почты'
    )
    first_name = models.CharField(max_length=150,)
    last_name = models.CharField(max_length=150,)
    bio = models.TextField(
        blank=True,
        help_text='Биография'
    )
    role = models.TextField(
        help_text='Роль'
    )
    friends = models.ManyToManyField('User', blank=True)
    is_fan = GenericRelation('FriendRequest')

    class Meta:
        ordering = ['id']
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username


class FriendRequest(models.Model):
    sender = models.ForeignKey(
        User, related_name='sender', on_delete=models.CASCADE, null=True)
    recipient = models.ForeignKey(
        User, related_name='recipient', on_delete=models.CASCADE, null=True
    )
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_pending = models.BooleanField(default=False)


class Friends(models.Model):
    user_id_1 = models.ForeignKey(
        User, related_name='user_id_1', on_delete=models.CASCADE, null=True)
    user_id_2 = models.ForeignKey(
        User, related_name='user_id_2', on_delete=models.CASCADE, null=True)
