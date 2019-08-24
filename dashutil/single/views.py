from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core import serializers

from .models import Single_File_Data
import json


# /single
@ensure_csrf_cookie
def single_home(request):
    if request.method == 'GET':
        return redirect('/')
    
    elif request.method == 'POST':
        file_to_post = request.FILES.getlist('file')[0]
        
        new_file_id = Single_File_Data.single_manager.upload_single_file(
            file_to_post)

        return JsonResponse({'new_file_id': str(new_file_id)})
    


# /single/single_page_id
def single_page(request, single_page_id):
    if request.method == 'GET':
        context, found = _get_context_for_single(single_page_id)
        
        if found:
            return render(request, 'single/single_file.html', context)
        else:
            return render(request, 'single/error.html', context)
        

# Returns the file found for the id, or if one was not found
def _get_context_for_single(single_page_id):
    context = {}
    found = False
    context['single_file_id'] = single_page_id

    single_file = Single_File_Data.single_manager.get_single_file_data(
        _convert_string(single_page_id))
    
    if single_file is not None:
        context['single_file'] = _serialize_files_as_json([single_file])
        found = True

    return context, found


# Serializes a list of files as a json object to return
def _serialize_files_as_json(files):
    return json.loads(serializers.serialize('json', files, 
        fields=('filename', 'upload_path', 'create_timestamp', 'modify_timestamp', 
            'size')))


def _convert_string(s):
    return s.replace('\\','').replace('/', '').replace('\'', '').replace('\"', '')
    