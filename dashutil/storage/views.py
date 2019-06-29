from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.edit import CreateView
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder

from .models import Storage, File_Data
import json

def storage_home(request):
    return HttpResponse("main storage page")


@ensure_csrf_cookie
def storage_page(request, storage_page_name):
    if request.method == "GET":
        storage, created = Storage.storage_manager.get_or_create_storage(
            _convert_string(storage_page_name))

        context = {}
        child_files = []
        if not created:
            # storage_page already existed, so pull all of the child files
            child_files = File_Data.file_datamanager.get_children_of_storage(storage)
        
        context['storage_files'] = json.loads(serializers.serialize('json', child_files, 
            fields=('filename', 'upload_path', 'create_timestamp', 'modify_timestamp', 
                'size', 'parent_directory')))

        context['storage_page_name'] = storage.storage_name
        context['storage_page_id'] = storage.id.id
        print(storage.id.id)
        return render(request, 'storage/file_in_storage_form.html', context)
    
    elif request.method == "POST":
        file_to_post = request.POST.dict()
        
        new_file_data = File_Data.file_datamanager.upload_new_file(
            file_to_post['new_filename'], float(file_to_post['new_size']), file_to_post['new_parent_id'])
        
        File_Data.file_datamanager.update_parent_directory_sizes_iteratively(new_file_data)

        storage, created = Storage.storage_manager.get_or_create_storage(
            _convert_string(storage_page_name))
        child_files = File_Data.file_datamanager.get_children_of_storage(storage)

        context = {}
        context['storage_files'] = json.loads(serializers.serialize('json', child_files,
            fields=('filename', 'upload_path', 'create_timestamp', 'modify_timestamp', 
                'size', 'parent_directory')))

        context['storage_page_name'] = storage.storage_name
        context['storage_page_id'] = storage.id.id
        print(storage.id.id)
        return render(request, 'storage/file_in_storage_form.html', context)

def _convert_string(s):
    return s.replace('\\','').replace('\/', '')
    

    
# class File_DataCreateView(CreateView):
# 	model = File_Data
# 	fields = ['upload', ]

# 	def get_context_data(self, **kwargs):
# 		context = super().getcontext_data(**kwargs)
# 		file = File_Data.objects.all()
# 		context['storage_files'] = files
# 		return context