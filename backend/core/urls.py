from django.urls import path, include
from .views import index, search_track, track_details, genre_template, get_tracks_by_genre, get_genre_map,  ranking_view, ChallengeSetViewSet, ChallengeViewSet, UserViewSet, AttemptViewSet, RandomAttemptViewSet
from rest_framework_nested import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

router = routers.DefaultRouter()
router.register(r"challenge_sets", ChallengeSetViewSet, basename="challenge_set")
router.register(r"users", UserViewSet, basename="user")
router.register(r"attempts", AttemptViewSet, basename="attempt")
router.register(r'random_attempts', RandomAttemptViewSet, basename="random_attempt")


nested = routers.NestedDefaultRouter(router, r"challenge_sets", lookup="challenge_set")
nested.register(r"challenges", ChallengeViewSet, basename="challenge_set_challenge")



urlpatterns = [
	path('', index),
	path('2', genre_template),
    path("search/", search_track, name="search_track"),
    path("track/<int:track_id>/", track_details, name="track_details"),
    path("genre/list/", get_tracks_by_genre, name="get_tracks_by_genre"),
    path("genre/map", get_genre_map, name="get_genre_map"),
    path("ranking/", ranking_view, name="ranking"),
    path("", include(router.urls)),
    path("", include(nested.urls)),
]

urlpatterns += [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("auth/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
]

urlpatterns += [
    path("schema/",   SpectacularAPIView.as_view(),               name="schema"),
    path("swagger/",  SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/",    SpectacularRedocView.as_view(url_name="schema"),   name="redoc"),
]