
from django.contrib import admin

from .models import FishingPlace, Profile, FishingPlaceImages, PlaceOrder, PlaceOrderImages, Friendship, UserMessage, \
    Room

admin.site.register(Profile)
admin.site.register(FishingPlace)
admin.site.register(FishingPlaceImages)
admin.site.register(PlaceOrder)
admin.site.register(PlaceOrderImages)
admin.site.register(Friendship)
admin.site.register(UserMessage)
admin.site.register(Room)
