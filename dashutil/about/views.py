from django.shortcuts import render
from django.conf import settings


def about_site(request):
    return render(request, 'about/site.html')

def about_api(request):
    return render(request, 'about/api.html')

def about_people(request):
    return render(request, 'about/people.html')