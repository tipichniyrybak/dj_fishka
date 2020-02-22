from django.forms import ModelForm
from .models import Profile

class renewProfileModelForm(ModelForm):
    class Meta:
        model = Profile
        # fields = ('first_name', 'last_name', 'photo', 'is_professional')
        exclude = ('user', )