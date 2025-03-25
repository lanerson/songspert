from django.urls import path
from .views import index, search_track, track_details, get_genre, genre_template

urlpatterns = [
	path('', index),
	path('2', genre_template),
    path("search/", search_track, name="search_track"),
    path("track/<int:track_id>/", track_details, name="track_details"),
    path("genre/", get_genre, name="get_genre"),
]