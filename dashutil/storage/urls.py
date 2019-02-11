from django.urls import path

from . import views


urlpatterns = [
	# ex: /storage
	path('', views.storage_home, name='storage_home'),

	# # ex: /create/allmyfiles
 #    path('<str:storage_page_name>', views.create_storage_page, name='storage_page'),

 #    # ex: /storage/allmyfiles/
 #    path('<str:storage_page_name>/', views.create_storage_page, name='storage_page'),

	# ex: /storage/allmyfiles
    path('<str:storage_page_name>', views.storage_page, name='storage_page'),

    # ex: /storage/allmyfiles/
    path('<str:storage_page_name>/', views.storage_page, name='storage_page'),
]