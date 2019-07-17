from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.edit import CreateView
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder

from .models import Storage, File_Data
import json



def storage_home(request):
    return redirect('/')


# /storage/storage_page_name
# request data for POSTing new file will have 
#       request.FILES           - FormData with all of the uploaded files
#       parent_directory_id     - id of the new file's parent directory
@ensure_csrf_cookie
def storage_page(request, storage_page_name):
    if request.method == "GET":
        context = _get_context_for_storage(storage_page_name)
        
        return render(request, 'storage/file_in_storage_form.html', context)
  
    elif request.method == "POST":
        parent_directory = File_Data.file_datamanager.get_file_data(
            request.POST.dict()['parent_directory_id'])
        
        new_data = []
        
        # if new_directory_name is set, create a new directory. otherwise,
        # upload the new files
        if ('new_directory_name' in request.POST.dict()):
            new_directory_name = request.POST.dict()['new_directory_name']

            new_data = File_Data.file_datamanager.create_new_directory(
                parent_directory, new_directory_name)  

        else:
            files_to_post = request.FILES.getlist('file')
            
            size_increase, new_data = File_Data.file_datamanager.upload_new_files(
                parent_directory, storage_page_name, files_to_post)
            
            File_Data.file_datamanager.update_parent_directory_sizes_iteratively(
                size_increase, parent_directory)

        return HttpResponse([_serialize_data_as_json(new_data)])


# Returns the appropriate context for a storage page
def _get_context_for_storage(storage_page_name):
    context = {}
    child_files = []

    storage, created = Storage.storage_manager.get_or_create_storage(
        _convert_string(storage_page_name))

    if not created:
        # storage_page already existed, so pull all of the child files
        child_files = File_Data.file_datamanager.get_children_of_storage(storage)

    context['storage_files'] = _serialize_data_as_json(child_files)
    context['storage_page'] = _serialize_data_as_json(
        [Storage.storage_manager.get_related_file_data(storage)])[0]

    return context


# Serializes a list of files as a json object to return
def _serialize_data_as_json(data_list):
    return json.loads(serializers.serialize('json', data_list, 
        fields=('filename', 'upload_path', 'create_timestamp', 'modify_timestamp', 
            'size', 'parent_directory')))


def _convert_string(s):
    return s.replace('\\','').replace('\/', '')
    