from django.forms import ModelForm
from .models import Profile
from django import forms


class AddPlaceForm(forms.Form):
    name = forms.CharField(label='Название места', max_length=100)
    lant = forms.DecimalField(label='Лантитуда', max_digits=10, decimal_places=8)
    long = forms.DecimalField(label='Лонгитуда', max_digits=10, decimal_places=8)
    description = forms.CharField(label='Описание',widget=forms.Textarea)
    is_Base = forms.BooleanField(label='База')
    car_accessibility = forms.BooleanField(label='Доступ на авто')
    bus_accessibility = forms.BooleanField(label='Доступ на общественном')