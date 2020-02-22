from django.contrib.auth import views as auth_views
from django.urls import path, include

from . import views

app_name = 'fish_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('workspace/', views.workspace, name='workspace'),
    # path('login/', auth_views.LoginView.as_view(), name='login'),
    path('login/', views.login, name='login'),
    # path('registration/', views.registration, name='registration'),
    path('get_places/', views.get_places, name='get_places'),
    path('get_place_info/', views.get_place_info, name='get_place_info'),
    path('add_place/', views.add_place, name='add_place'),
    path('get_profile_info/', views.get_profile_info, name='get_profile_info'),
    # path('change_profile/', views.change_profile, name='change_profile'),
    # path('<int:place_id>/', views.detail, name='detail'),
    # path('<int:place_id>/leave_comment', views.leave_comment, name='leave_comment')
]
