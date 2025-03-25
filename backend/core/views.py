from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, 'index.html')


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