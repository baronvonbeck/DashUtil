from django.http import HttpResponse


def about(request):
    return HttpResponse("Hello, world. You're at about page.")