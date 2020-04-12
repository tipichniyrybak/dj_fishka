from django.db import models
from django.contrib.auth.models import User
import os
import random
import string
from django.http import JsonResponse
from datetime import datetime
from itertools import chain


def get_path_to_save_photos(instance, filename):
    path = 'img/'
    if type(instance) == Profile:
        path = path + 'profile/'

    if type(instance) == FishingPlaceImages:
        path = path + 'places/'
        path = path + str(instance.fishing_place.id) + '/'

    if type(instance) == PlaceOrderImages:
        path = path + 'orders/'
        path = path + str(instance.place_order.id) + '/'

    letters = string.ascii_lowercase
    file_name = ''.join(random.choice(letters) for i in range(20))
    file_name = file_name + '.jpg'
        #'userID' + str(instance.user.id) + extension
    path = os.path.join(path, file_name)
    return path


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    photo = models.FileField(upload_to=get_path_to_save_photos, default='img/profile/no_photo.png')
    first_name = models.CharField('Name profile', max_length=50, default='Имя')
    last_name = models.CharField('Lastname profile', max_length=50, default='не назначено')
    is_professional = models.BooleanField(default=False)
    home_pond = models.CharField('Home pond', max_length=70, default='')
    lovely_pond = models.CharField('Lovely pond', max_length=70, default='')
    fishing_object = models.CharField('Lovely fishing object', max_length=70, default='')
    tackle = models.CharField('tackle', max_length=70, default='')
    fishing_style = models.CharField('fishing_style', max_length=70, default='')
    filters = models.CharField('filters', max_length=300,
                               default='{"is_selfPlaces": "false", "is_Base": "false", '
                                       '"is_carAccessibility": "false", "is_busAccessibility": "false"}')
    friends = models.CharField('Friends', max_length=250, default='{ "friends": [ ] }')
    requests_for_friendship = models.CharField('requests_for_friendship', max_length=250, default='{ "requests_for_friendship": [ ] }')

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'


class Friendship(models.Model):
    FriendshipStatus = (
        ('AC', 'ACCEPT'),
        ('CN', 'CANCELED'),
        ('WT', 'WAITING'),
    )

    user_requesting = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_requesting')
    user_receiving = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_receiving')
    status = models.CharField(max_length=255, choices=FriendshipStatus, default='WT')


class Chat(models.Model):
    users = models.ManyToManyField(User)


class UserMessage(models.Model):
    UserMessageStatus = (
        ('RD', 'READ'),
        ('UR', 'UNREAD'),
    )

    user_send = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_send')
    # user_receive = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_receive')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='chat')
    text = models.CharField(max_length=255, default='')
    status = models.CharField(max_length=255, choices=UserMessageStatus, default='UR')


class FishingPlace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField('Name of place', max_length=100)
    lant = models.DecimalField('Lant of place', max_digits=10, decimal_places=8)
    long = models.DecimalField('Long of place', max_digits=10, decimal_places=8)
    description = models.TextField('Description of place')
    is_Base = models.BooleanField(default=False)
    car_accessibility = models.BooleanField(default=False)
    bus_accessibility = models.BooleanField(default=False)
    datetime_publication = models.DateTimeField(default=datetime.now)

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
            return self


class FishingPlaceImages(models.Model):
    fishing_place = models.ForeignKey(FishingPlace, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_path_to_save_photos)
    caption = models.CharField('Caption of photo', max_length=150)

    class Meta:
        verbose_name = 'Фото рыболовного места'
        verbose_name_plural = 'Фото Рыболовных мест'


class PlaceOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fishing_place = models.ForeignKey(FishingPlace, on_delete=models.CASCADE)
    date_begin = models.DateField()
    date_end = models.DateField()
    description = models.TextField('Description of order')
    datetime_publication = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.user_id

    class Meta:
        verbose_name = 'Отчет о рыбалке'
        verbose_name_plural = 'Отчеты о рыбалке'

    def save(self, *args, **kwargs):
        super(PlaceOrder, self).save(*args, **kwargs)
        return self

    def get_photos(self):
        photos = PlaceOrderImages.objects.filter(place_order=self).values()
        return JsonResponse(list(photos), safe=False)


class PlaceOrderImages(models.Model):
    place_order = models.ForeignKey(PlaceOrder, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_path_to_save_photos)
    caption = models.CharField('Caption of photo', max_length=150)

    class Meta:
        verbose_name = 'Фото отчетов'
        verbose_name_plural = 'Фото отчетов'


class Fishing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fishing_place = models.ForeignKey(FishingPlace, on_delete=models.CASCADE)
    datetime_publication = models.DateTimeField(default=datetime.now)
    description = models.TextField('Description of fishing', default="fishing description")
    user_list = models.CharField('Users list', max_length=100, default='')
    max_users = models.IntegerField(default=0)
    # chat = models.TextField('fishing chat')

    class Meta:
        verbose_name = 'Рыбалка'
        verbose_name_plural = 'Рыбалки'

    def __str__(self):
        return self.id


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    receivers = models.CharField('Receivers', max_length=200, default='')
    msg_content = models.TextField('Msg_content')
    datetime_publication = models.DateTimeField(default=datetime.now)