from django.contrib import admin
from django.urls import include, path

from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

router = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('react/', TemplateView.as_view(template_name='react.html')),
    # path('api/profile/', include('users.urls')),
    path('api/vsas/', include('tweets.urls')),
    path('api/', include('api.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
