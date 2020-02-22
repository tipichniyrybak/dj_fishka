from django.shortcuts import render, redirect
from .models import FishingPlace, Order, Profile
from django.contrib.auth.models import User
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
    cur_profile = request.session['currentProfile']
    return render(request, 'fish_app/workspace.html', {'currentProfile': cur_profile, 'userID': user_id})


def index(request):
    return render(request, 'fish_app/index.html')


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            user_id = User.objects.get(username=user).id
            profile = Profile.objects.filter(user_id=user_id).values()
            profile_json = json.dumps(list(profile))
            # serialized_obj = serializers.serialize('json', [profile])
            # profile_json = json.dumps("data": profile)
            auth_login(request, user)
            request.session['userID'] = user_id
            request.session['currentProfile'] = profile_json
            return redirect('fish_app:workspace')
    else:
        form = AuthenticationForm()
    return render(request, 'fish_app/login.html', {'form': form})


def registration(request):
    return render(request, 'fish_app/regstration.html')


@csrf_exempt
def get_places(request):
    places = FishingPlace.objects.values()
    return JsonResponse(list(places), safe=False)


@csrf_exempt
def get_place_info(request):
    place_id = request.POST.get("place_id")

    ftp = FTP()
    ftp.connect('ftpupload.net', 21)
    ftp.login('epiz_24989236', 'FIbPfZKy3F')
    FTP_path = "/htdocs/media/img/places/" + str(place_id)
    ftp.cwd(FTP_path)

    tmp_path = os.path.join(settings.BASE_DIR, 'fish_pr', 'static', 'tmp_img', str(place_id))

    if not os._exists(tmp_path):
        os.mkdir(tmp_path)
    os.chdir(tmp_path)

    for filename in ftp.nlst('*.*'):
        fhandle = open(filename, 'wb')
        ftp.retrbinary('RETR ' + filename, fhandle.write)
        fhandle.close()
    ftp.close()

    place = FishingPlace.objects.filter(id=place_id).values()
    return JsonResponse(list(place), safe=False)


@csrf_exempt
def get_profile_info(request):
    user_id = request.POST.get("userID")
    user_by_id = User.objects.get(id=user_id)
    profile = Profile.objects.filter(user=user_by_id).values()
    return JsonResponse(list(profile), safe=False)

@csrf_exempt
def add_place(request):
    data = request.POST
    photos = request.FILES.getlist('files[]')
    place = FishingPlace(name=data.get('place_name'), lant=data.get('place_lant'), long=data.get('place_long'), description=data.get('place_description'), photos=data.get('place_photos'))
    id = place.save()
    if id != 0:
        ftp = FTP()
        ftp.connect('ftpupload.net', 21)
        ftp.login('epiz_24989236', 'FIbPfZKy3F')
        FTP_path = "/htdocs/media/img/places/" + str(id)
        if not FTP_path in ftp.nlst():
            ftp.mkd(FTP_path)
        ftp.cwd(FTP_path)

        photo_path = os.path.join(settings.BASE_DIR, 'fish_pr', 'static', 'tmp_img', str(id))
        fs = FileSystemStorage()
        for photo in photos:
            photo_pathname = default_storage.save(os.path.join(photo_path, photo.name), photo)
            fp = open(photo_pathname, 'rb')
            ftp.storbinary('STOR %s' % os.path.basename(photo.name), fp, 1024)
            fp.close()
            os.remove(photo_pathname)
        os.rmdir(photo_path)
    return JsonResponse(id, safe=False)



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
