from rest_framework import filters, mixins, viewsets


class BaseExcludePutMethodViewSet(viewsets.ModelViewSet):
    http_method_names = ('get', 'post', 'patch', 'delete')
