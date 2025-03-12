from django.shortcuts import render
import requests
import random
from django.http import JsonResponse

def get_random_deezer_track(request):
    """
    Fetch a list of top tracks from Deezer's Chart endpoint,
    pick one at random, and return the preview URL and track title.
    """
    try:
        # For example, get top tracks from the global chart (chart/0/tracks).
        url = "https://api.deezer.com/chart/0/tracks"
        response = requests.get(url)
        data = response.json()

        tracks = data.get('data', [])
        if not tracks:
            return JsonResponse({'error': 'No tracks found'}, status=404)

        # Pick a random track from the retrieved list
        random_track = random.choice(tracks)

        # Extract relevant info
        track_title = random_track.get('title', 'Unknown Title')
        preview_url = random_track.get('preview', '')
        artist_name = random_track.get('artist', {}).get('name', 'Unknown Artist')

        return JsonResponse({
            'title': track_title,
            'preview': preview_url,
            'artist': artist_name
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

