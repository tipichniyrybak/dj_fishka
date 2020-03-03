
from django.contrib import admin

from .models import FishingPlace, Order, Profile, FishingPlaceImages

admin.site.register(FishingPlace)
admin.site.register(FishingPlaceImages)
admin.site.register(Order)
admin.site.register(Profile)