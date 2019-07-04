from django.conf.urls import url
from django.urls import include, path
from django.contrib import admin


urlpatterns = [
    path('', include('home.urls')),
    path('about/', include('about.urls')),
    path('storage/', include('storage.urls')),
    path('single/', include('single.urls')),
]
