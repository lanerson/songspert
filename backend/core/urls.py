from django.urls import path
from .views import index, search_track, track_details, genre_template, get_tracks_by_genre, get_genre_map

urlpatterns = [
	path('', index),
	path('2', genre_template),
    path("search/", search_track, name="search_track"),
    path("track/<int:track_id>/", track_details, name="track_details"),
    path("genre/list/", get_tracks_by_genre, name="get_tracks_by_genre"),
    path("genre/map", get_genre_map, name="get_genre_map"),
]