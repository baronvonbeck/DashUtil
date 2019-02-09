from django.urls import path

from . import views


urlpatterns = [
	# ex: /about/
    path('', views.about_site, name='about_site'),
    path('site', views.about_site, name='about_site'),
    path('api', views.about_api, name='about_api'),
    path('people', views.about_people, name='about_people'),
]