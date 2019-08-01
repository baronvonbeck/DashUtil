from django.shortcuts import render
from django.conf import settings


def home(request):
    return render(request, 'home/home.html')

def mitm(request):
    print('here')
    return render(request, 'mitm/mitm.html')

def swjs(request):
    return render(request, 'serviceworker/sw.js', content_type='text/javascript')
