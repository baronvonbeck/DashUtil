from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.edit import CreateView


from .models import Storage, File_In_Storage


def storage_home(request):
    return HttpResponse("main storage page")


@ensure_csrf_cookie
def storage_page(request, storage_page_name):
	if request.method == "GET":
		print('get: ' + storage_page_name)

		storage, created = Storage.objects.get_or_create(
			storage_name = storage_page_name
		)

		if created:
			print('created: ' + storage_page_name)
		else:
			print('exists already')

	elif request.method == "POST":
		print('post: ' + storage_page_name)

	context = {}
	all_files = File_In_Storage.objects.all()
	context['storage_files'] = all_files

	return render(request, 'storage/file_in_storage_form.html', context)


# class File_In_StorageCreateView(CreateView):
# 	model = File_In_Storage
# 	fields = ['upload', ]

# 	def get_context_data(self, **kwargs):
# 		context = super().getcontext_data(**kwargs)
# 		file = File_In_Storage.objects.all()
# 		context['storage_files'] = files
# 		return context