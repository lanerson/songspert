import random, requests
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.utils.timezone import now
from django.db.models import Sum
from datetime import timedelta
from .models import Challenge, ChallengeSet, Attempt, RandomAttempt
from .serializers import ChallengeSerializer, ChallengeSetSerializer, UserReadSerializer, UserWriteSerializer, serializers, AttemptSerializer, RandomAttemptSerializer, ChallengeSetSummarySerializer
from drf_spectacular.utils import extend_schema
from datetime import datetime, timedelta, timezone
import pytz


User = get_user_model()

# Create your views here.

def index(request):
	return render(request, 'index.html')

def genre_template(request):
    return render(request, 'genre.html')



def search_track(request):
	query = request.GET.get("q", "")  # Obtém o termo da query
	if not query:
		return JsonResponse({"error": "Missing query parameter 'q'"}, status=400)

	url = f"{settings.DEEZER_API_URL}/search"
	params = {"q": query}

	response = requests.get(url, params=params)
	if response.status_code == 200:
		return JsonResponse(response.json())
	return JsonResponse({"error": "Failed to fetch data from Deezer"}, status=response.status_code)


def track_details(request, track_id):
	url = f"{settings.DEEZER_API_URL}/track/{track_id}"

	response = requests.get(url)
	if response.status_code == 200:
		return JsonResponse(response.json())
	return JsonResponse({"error": "Failed to fetch track details"}, status=response.status_code)

def fetch_genres():
    global GENRE_MAP
    response = requests.get(f"{settings.DEEZER_API_URL}/genre")
    data = response.json()
    genre_list = data.get("data", [])
    GENRE_MAP = {genre["name"].lower(): genre["id"] for genre in genre_list}

# Fetch genres when server starts
fetch_genres()


def get_genre_map(request):
    return JsonResponse({
        "genres": list(GENRE_MAP.keys())
    })

def get_tracks_by_genre(request):
    genre_name = request.GET.get("name", "").lower().strip()
    count = request.GET.get("n", "1")

    try:
        n = min(max(int(count), 1), 20)  # clamp between 1 and 20
    except ValueError:
        return JsonResponse({"error": "Invalid 'n' parameter"}, status=400)

    if not genre_name:
        return JsonResponse({"error": "Missing genre name"}, status=400)

    genre_id = GENRE_MAP.get(genre_name)
    if not genre_id:
        return JsonResponse({"error": f"Genre '{genre_name}' not found"}, status=404)

    url = f"{settings.DEEZER_API_URL}/chart/{genre_id}/tracks"
    response = requests.get(url)
    chart_data = response.json()
    tracks = chart_data.get("data", [])

    if not tracks:
        return JsonResponse({"error": f"No tracks found for genre '{genre_name}'"}, status=404)

    print("Requested:", n, "Available:", len(tracks))

    selected_tracks = random.sample(tracks, min(n, len(tracks)))


    return JsonResponse({
        "data": [
            {
                "id": track["id"],
                "title": track["title"],
                "artist": track["artist"]["name"],
                "preview": track["preview"],
                "picture": track["artist"]["picture_medium"],
                "rank": track["rank"]
            } for track in selected_tracks
        ]
    })

class ChallengeSetViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeSetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return ChallengeSet.objects.filter(created_by=user)

        return ChallengeSet.objects.all()
    
    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to create a ChallengeSet.")
        serializer.save(created_by=self.request.user)
    
    def perform_destroy(self, instance):
        if instance.created_by != self.request.user:
            raise PermissionDenied("Not your set.")
        super().perform_destroy(instance)

    @extend_schema(responses=ChallengeSetSummarySerializer(many=True))
    @action(detail=False, methods=["get"], url_path="summary", permission_classes=[AllowAny])
    def summary(self, request):
        sets = ChallengeSet.objects.all().only("id", "name", "genre", "created_by")
        serializer = ChallengeSetSummarySerializer(sets, many=True)
        return Response(serializer.data)




    
class ChallengeViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeSerializer
    permission_classes  = (AllowAny,)
    

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Challenge.objects.filter(
                challenge_set__created_by=user,
                challenge_set_id=self.kwargs["challenge_set_pk"]
            )
        # anonymous: show challenges for any set, or none:
        return Challenge.objects.filter(
            challenge_set_id=self.kwargs["challenge_set_pk"]
        )  # or .none()
    
    def perform_create(self, serializer):
        cs = get_object_or_404(
            ChallengeSet,
            pk=self.kwargs["challenge_set_pk"],
            created_by=self.request.user
        )
        if serializer.validated_data.get("type") != cs.category:
            raise serializers.ValidationError("Challenge type must match ChallengeSet category.")
        serializer.save(challenge_set=cs)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_permissions(self):
        if self.action == "me":            
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "me"):
               return UserReadSerializer
        return UserWriteSerializer
    
    @action(detail=False, methods=["get", "patch"], url_path="me",  permission_classes=[permissions.IsAuthenticated])

    def me(self, request):
        if request.method == "GET":
            serializer = UserReadSerializer(request.user)
            return Response(serializer.data)
        
        serializer = UserWriteSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserReadSerializer(request.user).data)

class AttemptViewSet(viewsets.ModelViewSet):
     serializer_class = AttemptSerializer
     permission_classes = [permissions.IsAuthenticated]

     def get_queryset(self):
        return Attempt.objects.filter(user=self.request.user)
     
     def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RandomAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = RandomAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RandomAttempt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
@permission_classes([AllowAny])
def ranking_view(request):
    period = request.GET.get("period", "week")

    # Define timezone UTC-3 (America/Sao_Paulo) para o reset
    tz = pytz.timezone("America/Sao_Paulo")
    now_ = now().astimezone(tz)

    if period == "day":
        since = now_.replace(hour=0, minute=0, second=0, microsecond=0)

    elif period == "week":
        # Calcula o último domingo 00:00
        weekday = now_.weekday()  # segunda=0, ..., domingo=6
        days_since_sunday = (weekday + 1) % 7
        since = (now_ - timedelta(days=days_since_sunday)).replace(hour=0, minute=0, second=0, microsecond=0)

    elif period == "month":
        since = now_.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    else:
        return Response({"error": "Invalid period. Use 'day', 'week' or 'month'."}, status=400)

    users = User.objects.all()
    ranking_data = []

    for user in users:
        challenge_score = user.attempts.filter(
            is_correct=True,
            submitted_at__gte=since
        ).aggregate(total=Sum("score"))["total"] or 0

        random_score = user.random_attempts.filter(
            submitted_at__gte=since
        ).aggregate(total=Sum("score"))["total"] or 0

        ranking_data.append({
            "user_id": user.id,
            "username": user.username,
            "challenge_points": challenge_score,
            "random_points": random_score,
            "total_points": challenge_score + random_score
        })

    ranking_data.sort(key=lambda u: u["total_points"], reverse=True)
    return Response(ranking_data)



      
