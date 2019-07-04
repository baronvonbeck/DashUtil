from django.urls import path

from . import views


urlpatterns = [
	# ex: /single
    # ex: /single/
	path('', views.single_home, name='single_home'),

	# ex: /single/mysinglefile
    path('<str:single_page_id>', views.single_page, name='single_page'),

    # ex: /single/mysinglefile/
    path('<str:single_page_id>/', views.single_page, name='single_page'),
]