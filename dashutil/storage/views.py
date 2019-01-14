from django.http import HttpResponse


def storage(request):
    return HttpResponse("Hello, world. You're at storage page.")