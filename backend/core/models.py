from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Track(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    preview = models.URLField()
    genre = models.CharField(max_length=100, blank=True)
class ChallegeSet(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return self.name

class Challenge(models.Model):
    challenge_set = models.ForeignKey(ChallegeSet, on_delete=models.CASCADE, null=True, blank=True, related_name='challenges')
    genre = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.track.title}"

class Attempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    Challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    challenge_set = models.ForeignKey(ChallegeSet, on_delete=models.CASCADE, null=True, blank=True)
    answer_text = models.CharField(max_length=255)
    is_correct = models.BooleanField()
    time_taken = models.FloatField(help_text="Time in seconds")
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} -> {self.Challenge} = {self.is_correct}"
    class GameRoom(models.Model):
        code = models.CharField(max_length=10, unique=True)
        host = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name='hosted_rooms'
        )
        players = models.ManyToManyField(
            settings.AUTH_USER_MODEL,
            related_name='joined_rooms'
        )
        challenge_set = models.ForeignKey(
            ChallegeSet,
            on_delete=models.SET_NULL,
            null=True,
            blank=True
        )
        created_at = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"Room {self.code} ({self.status})"
