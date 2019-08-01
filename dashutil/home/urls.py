from django.urls import path

from . import views


urlpatterns = [
	# ex: /
    path('', views.home, name='home'),
    path('mitm', views.mitm, name='mitm'),
    path('swjs', views.swjs, name='swjs'),
]