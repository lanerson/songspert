from django.urls import path
from . import views

urlpatterns = [
    path('random-track/', views.get_random_deezer_track, name='random-deezer-track'),
]
