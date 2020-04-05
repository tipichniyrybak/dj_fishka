# from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.conf import settings
from django.contrib.auth.views import auth_logout
from django.contrib.auth.views import LogoutView
from . import views

app_name = 'fish_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('workspace/', views.workspace, name='workspace'),
    path('friends/', views.friends, name='friends'),
    path('login/', views.login, name='login'),
    path('logout/', LogoutView.as_view(), {'next_page': settings.LOGOUT_REDIRECT_URL}, name='logout'),
    path('registration/', views.registration, name='registration'),

    path('pdetail<int:user_id>/', views.pdetail, name='pdetail'),

    path('get_profile_info/', views.get_profile_info, name='get_profile_info'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('add_request_for_friendship/', views.add_request_for_friendship, name='add_request_for_friendship'),
    path('add_to_friends/', views.add_to_friends, name='add_to_friends'),


    path('get_places/', views.get_places, name='get_places'),
    path('get_place_info/', views.get_place_info, name='get_place_info'),
    path('add_place/', views.add_place, name='add_place'),
    path('delete_place/', views.delete_place, name='delete_place'),

    path('add_order/', views.add_order, name='add_order'),
    path('get_orders/', views.get_orders, name='get_orders'),
    path('get_order_info/', views.get_order_info, name='get_order_info'),
    path('delete_order/', views.delete_order, name='delete_order'),



    # path('change_profile/', views.change_profile, name='change_profile'),

    # path('<int:place_id>/leave_comment', views.leave_comment, name='leave_comment')
]
