from django.shortcuts import render
from .models import Profile
from django.http import Http404

# Create your views here.


def profile_detail_view(request, username, *args, **kwargs):
    queryset = Profile.objects.filter(user__username=username)
    if not queryset.exists():
        raise Http404
    profile_obj = queryset.first()
