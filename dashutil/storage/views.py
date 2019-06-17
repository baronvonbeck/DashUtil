from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.edit import CreateView

from .models import Storage, File_Data


def storage_home(request):
    return HttpResponse("main storage page")


@ensure_csrf_cookie
def storage_page(request, storage_page_name):
    if request.method == "GET":
        storage, created = Storage.storage_manager.get_or_create_storage(storage_page_name)

        context = {}
        child_files = []
        if not created:
            # storage_page already existed, so pull all of the child files
            child_files = File_Data.file_datamanager.get_children_of_storage(storage)
        
        context['storage_files'] = child_files
        context['storage_name'] = storage_page_name
        return render(request, 'storage/file_in_storage_form.html', context)
    
    elif request.method == "POST":
        file_to_post = request.POST.dict()
        storage, created = Storage.storage_manager.get_or_create_storage(storage_page_name)
        
        new_file_data = File_Data.file_datamanager.upload_new_file(
            file_to_post['new_filename'], file_to_post['new_size'], storage)
        
        storage, created = Storage.storage_manager.get_or_create_storage(storage_page_name)

        context = {}
        context['storage_files'] = File_Data.file_datamanager.get_children_of_storage(storage)
        context['storage_name'] = storage_page_name
        return render(request, 'storage/file_in_storage_form.html', context)


# class File_DataCreateView(CreateView):
# 	model = File_Data
# 	fields = ['upload', ]

# 	def get_context_data(self, **kwargs):
# 		context = super().getcontext_data(**kwargs)
# 		file = File_Data.objects.all()
# 		context['storage_files'] = files
# 		return context