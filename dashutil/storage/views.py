from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.edit import CreateView
from storage.models import File_Data, Storage


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
        return render(request, 'storage/file_in_storage_form.html', context)


# class File_DataCreateView(CreateView):
# 	model = File_Data
# 	fields = ['upload', ]

# 	def get_context_data(self, **kwargs):
# 		context = super().getcontext_data(**kwargs)
# 		file = File_Data.objects.all()
# 		context['storage_files'] = files
# 		return context