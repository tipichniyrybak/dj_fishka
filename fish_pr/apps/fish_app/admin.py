
from django.contrib import admin

from .models import FishingPlace, Order, Profile

admin.site.register(FishingPlace)
admin.site.register(Order)
admin.site.register(Profile)