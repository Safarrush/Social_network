from django.contrib import admin

from .models import Tweet, TweetLike


# class TweetLikeAdmin(admin.TabularInline):
# model = TweetLike


@admin.register(Tweet)
class UserAdmin(admin.ModelAdmin):
    # inlines = [TweetLikeAdmin]
    list_display = (
        '__str__',
        #     'user',
    )
   # search_fields = ['content', 'user__username', 'user__email']
    list_filter = ('content',)

    class Meta:
        model = Tweet
