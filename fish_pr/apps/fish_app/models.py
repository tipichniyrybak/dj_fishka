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
    telegram_id = models.CharField('telegram_id', max_length=10, default='')

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
    status = models.CharField(max_length=2, choices=FriendshipStatus, default='WT')


class Room(models.Model):
    name = models.CharField(max_length=100, default='', blank=True)
    datetime_last_active = models.DateTimeField(default=datetime(1970, 0o01, 0o01))
    users = models.ManyToManyField(User, default=[])

    # def __str__(self):
    #     if self.users.all().count() == 2:
    #         return 'Чат c ' + self.users.objects.filter(id__not_in=[req])
    #     return self.name


class UserMessage(models.Model):
    UserMessageStatus = (
        ('RD', 'READ'),
        ('UR', 'UNREAD'),
    )

    user_send = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_send')
    # user_receive = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_receive')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='chat')
    text = models.CharField(max_length=255, default='')
    datetime_sending = models.DateTimeField(default=datetime.now)
    status = models.CharField(max_length=255, choices=UserMessageStatus, default='UR')

    def save(self, *args, **kwargs):
        self.room.datetime_last_active = self.datetime_sending
        self.room.save()
        super(UserMessage, self).save(*args, **kwargs)


class FishingPlace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField('Name of place', max_length=100)
    lant = models.DecimalField('Lant of place', max_digits=10, decimal_places=8, default=0)
    long = models.DecimalField('Long of place', max_digits=10, decimal_places=8, default=0)
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
    lant = models.DecimalField('Lant of place', max_digits=10, decimal_places=8, default=0)
    long = models.DecimalField('Long of place', max_digits=10, decimal_places=8, default=0)
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
    #creator = models.ForeignKey(User, on_delete=models.CASCADE)
    fishing_place = models.ForeignKey(FishingPlace, on_delete=models.CASCADE)
    lant = models.DecimalField('Lant of place', max_digits=10, decimal_places=8, default=0)
    long = models.DecimalField('Long of place', max_digits=10, decimal_places=8, default=0)
    datetime_publication = models.DateTimeField(default=datetime.now)
    description = models.TextField('Description of fishing', default="fishing description")
    # user_list = models.CharField('Users list', max_length=100, default='')
    users = models.ManyToManyField(User, blank=True)
    max_users = models.IntegerField(default=0)
    # chat = models.TextField('fishing chat')

    class Meta:
        verbose_name = 'Рыбалка'
        verbose_name_plural = 'Рыбалки'

    def save(self, request, *args, **kwargs):
        self.users[0] = request.user
        super(FishingPlace, self).save(*args, **kwargs)
        # return FishingPlace.objects.filter(name=self.name).values('id')
        return self

    # def save_model(self, request, obj, form, change):
    #     obj.users[0] = request.user
    #     obj.added_by = request.user
    #     super().save_model(request, obj, form, change)

    def __str__(self):
        return str(self.id)


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    receivers = models.CharField('Receivers', max_length=200, default='')
    msg_content = models.TextField('Msg_content')
    datetime_publication = models.DateTimeField(default=datetime.now)


class IFish(models.Model):
    name = models.CharField('name', max_length=60, default='fish_name')                             # Название
    photo_src = models.CharField('photo_src', max_length=256, default='')                           # Путь к фото
    lat_name = models.CharField('lat_name', max_length=60, default='fish_lat_name')                 # Латинское название
    another_name = models.CharField('another_name', max_length=256, default='fish_another_name')    # Другие названия
    family = models.CharField('family', max_length=60, default='fish_family')                       # Семейство
    genus = models.CharField('genus',  max_length=60, default='fish_genus')                         # Род
    kind = models.CharField('kind',  max_length=60, default='fish_kind')                            # Тип
    lifestyle = models.CharField('lifestyle', max_length=256, default='fish_lifestyle')             # Образ жизни
    food_type = models.CharField('food_type',  max_length=256, default='fish_food_type')            # Тип питания
    habitat = models.TextField('habitat', default='fish_habitat')                                   # Ареал обитания
    description = models.TextField('description', default='fish_description')                       # Описание
    appearance = models.TextField('appearance', default='fish_appearance')                          # Внешний вид
    behavior_features = models.TextField('behavior_features', default='fish_behavior_features')     # Особенности поведения
    food_features = models.TextField('food_features', default='fish_food_features')                 # Особенности питания
    reproduction = models.TextField('reproduction', default='fish_reproduction')                    # Размножение
    fishing_style = models.TextField('fishing_style', default='fishing_style')                      # Особенности ловли



