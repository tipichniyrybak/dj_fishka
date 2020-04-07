from django.shortcuts import render, redirect
from .models import FishingPlace, Profile, FishingPlaceImages, PlaceOrder, PlaceOrderImages, Friendship
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
from django.contrib.auth import logout as auth_logout
import json
from datetime import datetime
from .forms import AddPlaceForm
import boto3


def workspace(request):
    user_id = request.session['userID']
    return render(request, 'fish_app/workspace.html', {'userID': user_id})


def index(request):
    is_logged = 0
    current_user_id = 0
    if request.user.is_authenticated:
        is_logged = 1
        current_user_id = request.session['userID']
    return render(request, 'fish_app/index.html', {'is_logged': is_logged, 'current_user_id': current_user_id})


def friends(request):
    curr_prof = Profile.objects.get(user_id=request.user.id)
    try:
        # requests_for_friendship = json.loads(curr_prof.requests_for_friendship)
        users_id_requesting_friendship = json.loads(curr_prof.requests_for_friendship)["requests_for_friendship"]
        users_id_friends = json.loads(curr_prof.friends)["friends"]
    except:
        curr_prof.requests_for_friendship = json.dumps({"requests_for_friendship": []})
        users_id_requesting_friendship = []
        curr_prof.friends = json.dumps({"friends": []})
        users_id_friends = []


    for i in range(0, len(users_id_requesting_friendship)):
        try:
            users_id_requesting_friendship[i] = int(users_id_requesting_friendship[i])
        except:
            del users_id_requesting_friendship[i]

    profiles_requesting_friendship = Profile.objects.filter(user_id__in=users_id_requesting_friendship)
    profiles_friends = Profile.objects.filter(user_id__in=users_id_friends)

    return render(request, 'fish_app/friends.html', {'profiles_requesting_friendship': profiles_requesting_friendship,
                                                     'profiles_friends': profiles_friends})


@csrf_exempt
def add_request_for_friendship(request):
    receive_profile = Profile.objects.get(user_id=request.POST.get("receive_user_id"))
    res = 1

    f = Friendship.objects.create(user_requesting=User.objects.get(id=request.user.id),
                                  user_receiving=User.objects.get(id=request.POST.get("receive_user_id")))
    f.save()

    # try:
    #     requests_for_friendship = json.loads(receive_profile.requests_for_friendship)
    #     users = requests_for_friendship["requests_for_friendship"]
    #     if request.user.id not in users:
    #         users.append(request.user.id)
    #         receive_profile.requests_for_friendship = json.dumps(requests_for_friendship)
    #         res = 1
    # except:
    #     receive_profile.requests_for_friendship = '{ "requests_for_friendship": [' + str(request.user.id) + '] }'  # json.dumps(request.user.id)
    #     res = 1
    # receive_profile.save()
    return JsonResponse(res, safe=False)


@csrf_exempt
def add_to_friends(request):
    request.POST.get("request_user_id")
    curr_prof = Profile.objects.get(user_id=request.user.id)
    requests_for_friendship = json.loads(curr_prof.requests_for_friendship)
    users_requests = requests_for_friendship["requests_for_friendship"]
    users_requests.remove(int(request.POST.get("request_user_id")))
    curr_prof.requests_for_friendship = json.dumps({"requests_for_friendship": users_requests})

    try:
        friends = json.loads(curr_prof.friends)
        users_friends = friends["friends"]
        if int(request.POST.get("request_user_id")) not in users_friends:
            users_friends.append(int(request.POST.get("request_user_id")))
            curr_prof.friends = json.dumps(friends)
    except:
        curr_prof.friends = json.dumps({"friends": [request.POST.get("request_user_id")]})
    curr_prof.save()

    requestProf = Profile.objects.get(user_id=request.POST.get("request_user_id"))
    try:
        friends = json.loads(requestProf.friends)
        users_friends = friends["friends"]
        if int(request.user.id) not in users_friends:
            users_friends.append(int(request.user.id))
            requestProf.friends = json.dumps(friends)
    except:
        requestProf.friends = json.dumps({"friends": [request.user.id]})
    requestProf.save()

    return JsonResponse(1, safe=False)


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            user_id = User.objects.get(username=user).id
            auth_login(request, user)
            request.session['userID'] = user_id
            return redirect('fish_app:index')
    else:
        form = AuthenticationForm()
    return 1


def logout(request):
    if request.method == 'POST':
        auth_logout(request)
        return redirect('fish_app:index')
    return HttpResponse('fish_app:index')


def registration(request):
    if request.method == 'POST':
        form = UserCreationForm(data=request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            user = User.objects.get(username=username)
            raw_password = form.cleaned_data.get('password1')
            profile = Profile(user=user)
            profile.save()
            return redirect('fish_app:index')
    else:
        form = UserCreationForm()
    return render(request, 'fish_app/registration.html', {'form': form})


def pdetail(request, user_id):
    try:
        p = Profile.objects.get(user_id=user_id)

    except:
        raise Http404("Данные не найдены!..")

    # latest_order_list = p.order_set.order_by('-id')[:10]
    current_user_id = 0
    if request.user.is_authenticated:
        is_logged = 1
        current_user_id = request.session['userID']

    return render(request, 'fish_app/pdetail.html', {'profile': p, 'profile_user_id': user_id})


@csrf_exempt
def get_profile_info(request):
    user_id = request.user.id
    user_by_id = User.objects.get(id=user_id)
    profile = Profile.objects.filter(user=user_by_id).values()
    return JsonResponse(list(profile), safe=False)


@csrf_exempt
def update_profile(request):
    uid = request.user.id
    us = User.objects.get(id=uid)
    current_profile = Profile.objects.get(user=us)
    type_info = request.POST.get("typeInfo")
    photo = request.FILES.getlist('profile_files')

    res = 0

    if type_info == 'main':
        current_profile.first_name = request.POST.get("first_name")
        current_profile.last_name = request.POST.get("last_name")

        current_profile.home_pond = request.POST.get("home_pond")
        current_profile.lovely_pond = request.POST.get("lovely_pond")
        current_profile.fishing_object = request.POST.get("fishing_object")
        current_profile.tackle = request.POST.get("tackle")
        current_profile.fishing_style = request.POST.get("fishing_style")

        if len(photo) > 0:
            if current_profile.photo != 'img/profile/no_photo.png':
                current_profile.photo.delete(save=False)
            current_profile.photo = photo[0]
        res = 1

    if type_info == 'filters':
        current_profile.filters = json.dumps({
            'is_selfPlaces': request.POST.get("is_selfPlaces"),
            'is_Base': request.POST.get("is_Base"),
            'is_carAccessibility': request.POST.get("is_carAccessibility"),
            'is_busAccessibility': request.POST.get("is_busAccessibility")
        })
        res = 2

    current_profile.save()
    return JsonResponse(res, safe=False)


@csrf_exempt
def get_places(request):
    user_id = request.user.id
    # usr_id = request.session['userID']

    try:
        filt = Profile.objects.filter(user_id=request.user.id).values('filters')         #  JSON B JSONe
        filt1 = filt[0]
        filt2 = filt1["filters"]
        filters = json.loads(filt2)
    except:
        filters = json.loads('{"is_selfPlaces": "false", "is_Base": "false", '
                             '"is_carAccessibility": "false", "is_busAccessibility": "false"}')

    places = FishingPlace.objects.values()
    if filters["is_selfPlaces"] == 'true':
        places = places.filter(user_id=request.user.id)
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
    data_type = request.POST.get("data_type")

    if data_type == 'info':
        place = FishingPlace.objects.filter(id=place_id).values()
        return JsonResponse(list(place), safe=False)
    if data_type == 'photos':
        place = FishingPlace.objects.get(pk=place_id)

        image_list = FishingPlaceImages.objects.filter(fishing_place=place).values()
        return JsonResponse(list(image_list), safe=False)


@csrf_exempt
def add_place(request):
    data = request.POST
    photos = request.FILES.getlist('place_files[]')

    place = FishingPlace(user=User.objects.get(id=int(data.get('userID'))), lant=float(data.get('lant')), long=float(data.get('long')),
                         name=data.get('name'), description=data.get('description'),
                         is_Base=(data.get('isBase') == 'true'), car_accessibility=(data.get('carAccessability') == 'true'),
                         bus_accessibility=(data.get('busAccessability') == 'true')).save()
    if place != 0:
        for photo in photos:
            image_fishing_place = FishingPlaceImages(fishing_place=place, image=photo, caption='Caption #5')
            image_fishing_place.save()
    return JsonResponse(place.id, safe=False)


@csrf_exempt
def delete_place(request):
    place_id = request.POST.get("place_id")                         # TODO delete all PlaceOrders?
    place = FishingPlace.objects.get(id=place_id)
    photos = FishingPlaceImages.objects.filter(fishing_place=place)

    # Retrieve a bucket's ACL
    s3 = boto3.client('s3')
    result = ''
    # result = s3.get_bucket_acl(Bucket='fishkadata')
    print('res:' + result)

    for photo in photos:
        # os.remove('fish_pr/' + settings.MEDIA_URL + photo.image.name)
        # photo.delete(save=False)
        photo.delete()

        path = os.path.dirname(photo.image.name)

    # os.rmdir('fish_pr/' + settings.MEDIA_URL + path)
    photos.delete()  # current_profile.photo.delete(save=False)
    place.delete()
    res = 1
    return JsonResponse(res, safe=False)


@csrf_exempt
def get_orders(request):
    place = FishingPlace.objects.get(id=request.POST.get("place_id"))
    orders = PlaceOrder.objects.filter(fishing_place=place).values('user', 'date_begin', 'id')
    return JsonResponse(list(orders), safe=False)


@csrf_exempt
def get_order_info(request):
    order_id = request.POST.get("order_id")
    data_type = request.POST.get("data_type")

    if data_type == 'info':
        order = PlaceOrder.objects.filter(id=order_id).values()
        return JsonResponse(list(order), safe=False)
    if data_type == 'photos':
        order = PlaceOrder.objects.get(pk=order_id)

        image_list = PlaceOrderImages.objects.filter(place_order=order).values()
        return JsonResponse(list(image_list), safe=False)


@csrf_exempt
def add_order(request):
    data = request.POST
    photos = request.FILES.getlist('order_files[]')

    order = PlaceOrder(user=User.objects.get(id=int(data.get('user_id'))), fishing_place=FishingPlace.objects.get(id=int(data.get('place_id'))),
                       date_begin=datetime.strptime(data.get('date_begin'), '%Y-%m-%d').date(),
                       date_end=datetime.strptime(data.get('date_end'), '%Y-%m-%d').date(),
                       description=data.get('description')).save()
    if order != 0:
        for photo in photos:
            image_place_order = PlaceOrderImages(place_order=order, image=photo, caption='Caption #7')
            image_place_order.save()
    return JsonResponse(order.id, safe=False)


@csrf_exempt
def delete_order(request):
    order_id = request.POST.get("order_id")
    order = PlaceOrder.objects.get(id=order_id)
    photos = PlaceOrderImages.objects.filter(place_order=order)
    for photo in photos:
        photo.delete()
    #     os.remove('fish_pr/' + settings.MEDIA_URL + photo.image.name)
    #     path = os.path.dirname(photo.image.name)
    # os.rmdir('fish_pr/' + settings.MEDIA_URL + path)

    photos.delete()
    order.delete()
    res = 1
    return JsonResponse(res, safe=False)


# def leave_comment(request, place_id):
#     try:
#         p = FishingPlace.objects.get(id=place_id)
#     except:
#         raise Http404("Данные не найдены!..")
#
#     p.order_set.create(user_id=2, description=request.POST['description'], photos="pic.jpg")
#     return HttpResponseRedirect(reverse('workspace:detail', args=(p.id,)))
