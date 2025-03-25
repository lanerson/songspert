from django.urls import path
from .views import index, search_track, track_details

urlpatterns = [
	path('', index),
    path("search/", search_track, name="search_track"),
    path("track/<int:track_id>/", track_details, name="track_details"),
    path("genre/", genre_request, name="genre_request"),
]