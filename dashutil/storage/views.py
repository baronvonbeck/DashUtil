from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie


from .models import Storage


def storage_home(request):
    return HttpResponse("main storage page")

@ensure_csrf_cookie
def storage_page(request, storage_page_name):
	
	storage, created = Storage.objects.get_or_create(
		storage_name=storage_page_name
	)

	if created:
		print('here: ' + storage_page_name)
	else:
		print('nonono')
	

	return HttpResponse("Hello, world. You're at storage page: " + storage_page_name)