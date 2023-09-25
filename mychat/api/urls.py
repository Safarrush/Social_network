from api.views import CustomUserViewSet
from django.urls import include, path
from rest_framework import routers
from api.views import UserViewSet, UserProfileView, RemoveFriendRequestView, CanceleFriendRequestView, AcceptFriendRequestView, OutcomingRequestsView, IncomingRequestsView, UserFriendView, SendFriendRequestView, RemoveFriendView

router = routers.DefaultRouter()
router.register('users', CustomUserViewSet)
router.register('profile', UserViewSet, basename='users')


urlpatterns = [
    path('auth/', include('djoser.urls.authtoken')),
    path("my-friends/", UserFriendView.as_view()),
    path("unfriend/<int:pk>/", RemoveFriendView.as_view()),
    path("befriend/<int:pk>/", SendFriendRequestView.as_view()),
    path("outcoming/", OutcomingRequestsView.as_view()),
    path("accept/<int:pk>/", AcceptFriendRequestView.as_view()),
    path("remove/<int:pk>/", RemoveFriendRequestView.as_view()),
    path("cancel/<int:pk>/", CanceleFriendRequestView.as_view()),
    path("incoming/", IncomingRequestsView.as_view()),
    path("profile/<int:pk>/", UserProfileView.as_view()),

    path('', include(router.urls))
]
