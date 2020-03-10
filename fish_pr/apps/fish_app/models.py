from django.db import models
from django.contrib.auth.models import User
import os
import random
import string
from django.http import JsonResponse


def get_path_to_save_photos(instance, filename):
    path = 'img/'
    if type(instance) == Profile:
        path = path + 'profile/'

    if type(instance) == FishingPlaceImages:
        path = path + 'places/'

    letters = string.ascii_lowercase
    file_name = ''.join(random.choice(letters) for i in range(20))
    file_name = file_name + '.jpg'
        #'userID' + str(instance.user.id) + extension
    path = os.path.join(path, file_name)
    return path


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    photo = models.FileField(upload_to=get_path_to_save_photos)
    first_name = models.CharField('Name profile', max_length=50)
    last_name = models.CharField('Lastname profile', max_length=50)
    is_professional = models.BooleanField(default=False)
    home_pond = models.CharField('Home pond', max_length=70)
    lovely_pond = models.CharField('Lovely pond', max_length=70)
    fishing_object = models.CharField('Lovely fishing object', max_length=70)
    tackle = models.CharField('tackle', max_length=70)
    fishing_style = models.CharField('fishing_style', max_length=70)
    filters = models.CharField('filters', max_length=300)

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'


class FishingPlace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField('Name of place', max_length=100)
    lant = models.DecimalField('Lant of place', max_digits=10, decimal_places=8)
    long = models.DecimalField('Long of place', max_digits=10, decimal_places=8)
    description = models.TextField('Description of place')
    is_Base = models.BooleanField(default=False)
    car_accessibility = models.BooleanField(default=False)
    bus_accessibility = models.BooleanField(default=False)
    # photos = models.ImageField(upload_to=get_path_to_save_photos)

    def __str__(self):
        return self.name

    def get_photos(self):
        photos = FishingPlaceImages.objects.filter(fishing_place=self).values()
        return JsonResponse(list(photos), safe=False)


    class Meta:
        verbose_name = 'Рыболовное место'
        verbose_name_plural = 'Рыболовные места'

    def save(self, *args, **kwargs):
        if FishingPlace.objects.filter(name=self.name).exists():
            print('Place name already exists!')
            return 0
        else:
            super(FishingPlace, self).save(*args, **kwargs)
            # return FishingPlace.objects.filter(name=self.name).values('id')
            return self.id

class FishingPlaceImages(models.Model):
    fishing_place = models.ForeignKey(FishingPlace, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_path_to_save_photos)

    class Meta:
        verbose_name = 'Фото рыболовного места'
        verbose_name_plural = 'Фото Рыболовных мест'


class Order(models.Model):
    fishing_place = models.ForeignKey(FishingPlace, on_delete=models.CASCADE)
    user_id = models.IntegerField()
    description = models.TextField('Description of order')
    photos = models.CharField('Photos of order', max_length=300)

    def __str__(self):
        return self.user_id

    class Meta:
        verbose_name = 'Отчет о рыбалке'
        verbose_name_plural = 'Отчеты о рыбалке'
