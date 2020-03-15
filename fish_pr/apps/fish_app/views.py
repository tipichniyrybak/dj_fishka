from django.shortcuts import render, redirect
from .models import FishingPlace, Order, Profile, FishingPlaceImages
from .forms import renewProfileModelForm
from django.contrib.auth.models import User
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.http import Http404, HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict
from ftplib import FTP
from werkzeug.utils import secure_filename
import os
from django.core.files.storage import default_storage
from django.core.files.storage import FileSystemStorage, default_storage
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.templatetags.static import static
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login as auth_login
import json


def workspace(request):
    user_id = request.session['userID']
    # cur_profile = request.session['currentProfile']
    renewProfileForm = renewProfileModelForm()

    return render(request, 'fish_app/workspace.html', {'userID': user_id,
                                                       'renewProfileForm': renewProfileForm})


@csrf_exempt
def update_profile(request):
    currentProfile = Profile.objects.get(user=User.objects.get(id=request.POST.get("userID")))
    typeInfo = request.POST.get("typeInfo")
    res = 0

    if typeInfo == 'main':
        currentProfile.first_name = request.POST.get("first_name")
        currentProfile.last_name = request.POST.get("last_name")

        currentProfile.home_pond = request.POST.get("home_pond")
        currentProfile.lovely_pond = request.POST.get("lovely_pond")
        currentProfile.fishing_object = request.POST.get("fishing_object")
        currentProfile.tackle = request.POST.get("tackle")
        currentProfile.fishing_style = request.POST.get("fishing_style")
        res = 1

    if typeInfo == 'filters':
        currentProfile.filters = json.dumps({
            'is_selfPlaces': request.POST.get("is_selfPlaces"),
            'is_Base': request.POST.get("is_Base"),
            'is_carAccessibility': request.POST.get("is_carAccessibility"),
            'is_busAccessibility': request.POST.get("is_busAccessibility")
        })
        res = 2

    currentProfile.save()
    return JsonResponse(res, safe=False)


def index(request):
    return render(request, 'fish_app/index.html')


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            user_id = User.objects.get(username=user).id
            # profile = Profile.objects.filter(user_id=user_id).values()
            # profile_json = json.dumps(list(profile))
            auth_login(request, user)
            request.session['userID'] = user_id
            # request.session['currentProfile'] = profile_json
            return redirect('fish_app:workspace')
    else:
        form = AuthenticationForm()
    return render(request, 'fish_app/login.html', {'form': form})


def registration(request):
    return render(request, 'fish_app/regstration.html')


@csrf_exempt
def get_places(request):
    user_id = request.POST.get("userID")
    filt = Profile.objects.filter(user_id=user_id).values('filters')         #  JSON B JSONe
    filt1 = filt[0]
    filt2 = filt1["filters"]
    filters = json.loads(filt2)

    places = FishingPlace.objects.values()
    if filters["is_selfPlaces"] == 'true':
        places = places.filter(user_id=user_id)
    if filters["is_Base"] == 'true':
        places = places.filter(is_Base=True)
    if filters["is_carAccessibility"] == 'true':
        places = places.filter(car_accessibility=True)
    if filters["is_busAccessibility"] == 'true':
        places = places.filter(bus_accessibility=True)

    return JsonResponse(list(places), safe=False)


@csrf_exempt
def get_place_info(request):
    place_id = request.POST.get("place_id")
    type = request.POST.get("data_type")

    if type == 'info':
        place = FishingPlace.objects.filter(id=place_id).values()
        return JsonResponse(list(place), safe=False)
    if type == 'photos':
        place = FishingPlace.objects.get(pk=place_id)

        image_list = FishingPlaceImages.objects.filter(fishing_place=place).values()
        # image_list = place.FishingPlaceImages.all()
        return JsonResponse(list(image_list), safe=False)


@csrf_exempt
def get_profile_info(request):
    user_id = request.POST.get("userID")
    user_by_id = User.objects.get(id=user_id)
    profile = Profile.objects.filter(user=user_by_id).values()
    return JsonResponse(list(profile), safe=False)

@csrf_exempt
def add_place(request):
    data = request.POST
    photos = request.FILES.getlist('place_files[]')

    place = FishingPlace(user_id=int(data.get('userID')), lant=float(data.get('lant')), long=float(data.get('long')),
                         name=data.get('name'), description=data.get('description'),
                         is_Base=(data.get('isBase') == 'true'), car_accessibility=(data.get('carAccessability') == 'true'),
                         bus_accessibility=(data.get('busAccessability') == 'true')).save()
    # id = place.save()
    if place != 0:
        for photo in photos:
            imageFishingPlace = FishingPlaceImages(fishing_place=place, image=photo, caption='Caption #5')
            imageFishingPlace.save()
    return JsonResponse(place.id, safe=False)



# def detail(request, place_id):
#     try:
#         p = FishingPlace.objects.get( id=place_id)
#     except:
#         raise Http404("Данные не найдены!.." )
#
#     latest_order_list = p.order_set.order_by('-id')[:10]
#
#     return render(request, 'workspace/detail.html', {'place': p, 'latest_order_list': latest_order_list})
#
# def leave_comment(request, place_id):
#     try:
#         p = FishingPlace.objects.get(id=place_id)
#     except:
#         raise Http404("Данные не найдены!..")
#
#     p.order_set.create(user_id=2, description=request.POST['description'], photos="pic.jpg")
#     return HttpResponseRedirect(reverse('workspace:detail', args=(p.id,)))
