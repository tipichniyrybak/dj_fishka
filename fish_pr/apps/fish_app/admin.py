
from django.contrib import admin

from .models import FishingPlace, Profile, FishingPlaceImages, PlaceOrder, PlaceOrderImages

admin.site.register(Profile)
admin.site.register(FishingPlace)
admin.site.register(FishingPlaceImages)
admin.site.register(PlaceOrder)
admin.site.register(PlaceOrderImages)