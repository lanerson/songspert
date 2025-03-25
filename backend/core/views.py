from django.shortcuts import render
import random

# Create your views here.

def index(request):
	return render(request, 'index.html')

def genre_template(request):
    return render(request, 'genre.html')

import requests
from django.http import JsonResponse
from django.conf import settings


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
	

def get_genre(request):
	genre_name = request.GET.get("name", "").lower().strip()
	if not genre_name:
		return JsonResponse({"error": "Missing query parameter 'name'"}, status=400)

	if not GENRE_MAP:
		fetch_genres()

	genre_id = GENRE_MAP.get(genre_name)
	if not genre_id:
		return JsonResponse({"error": f'Genre: "{genre_name}" not found'}, status=404)
	
	url = f"{settings.DEEZER_API_URL}/chart/{genre_id}/tracks"
	response = requests.get(url)
	chart_data = response.json()
	tracks = chart_data.get("data", [])

	if not tracks:
		return JsonResponse({"error": f'No tracks found for genre "{genre_name}"'}, status=404)

	track = random.choice(tracks)
	return JsonResponse({
		"data": [
			{
				"title": track["title"],
				"artist": track["artist"]["name"],
				"preview": track["preview"]
			}
    	]	
	})
