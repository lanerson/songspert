from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import ChallengeSet, Challenge, Track, Attempt, RandomAttempt
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.db.models import Sum
from datetime import timedelta
import requests

User = get_user_model()

class UserReadSerializer(serializers.ModelSerializer):
    completed_challenges = serializers.SerializerMethodField()
    challenge_points = serializers.SerializerMethodField()
    random_points = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "daily_points", "weekly_points", "monthly_points", "profile_picture", "completed_challenges", "challenge_points", "random_points")

    def get_completed_challenges(self, user):
        attempts = user.attempts.filter(is_correct=True).values("challenge_set_id", "score")
        return [
            {
                "challenge_set_id": a["challenge_set_id"],
                "score": a["score"]
            }
            for a in attempts
        ]
    
    def get_challenge_points(self, user):
        return user.attempts.filter(is_correct=True).aggregate(total=Sum("score"))["total"] or 0
    
    def get_random_points(self, user):
        return user.random_attempts.aggregate(total=Sum("score"))["total"] or 0
    
    def _get_points(self, queryset):
        now_ = now()
        day_ago = now_ - timedelta(days=1)
        week_ago = now_ - timedelta(days=7)
        month_ago = now_ - timedelta(days=30)

        return {
            "day": queryset.filter(timestamp__gte=day_ago).aggregate(total=Sum("score"))["total"] or 0,
            "week": queryset.filter(timestamp__gte=week_ago).aggregate(total=Sum("score"))["total"] or 0,
            "month": queryset.filter(timestamp__gte=month_ago).aggregate(total=Sum("score"))["total"] or 0,
        }

class UserWriteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "daily_points", "weekly_points", "monthly_points", "profile_picture")
        read_only_fields = ("id",)

    def create(self, validated_data):
        pwd = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(pwd)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        pwd = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if pwd:
            instance.set_password(pwd)
        instance.save()
        return instance

class ChallengeSerializer(serializers.ModelSerializer):
    false_options = serializers.ListField(
        child=serializers.CharField(),
        min_length=4,
        max_length=4
    )
    correct_answer = serializers.SerializerMethodField(read_only=True)
    type = serializers.CharField()  # Now it's read-only, auto-filled from ChallengeSet

    class Meta:
        model = Challenge
        fields = ("id", "track", "type", "false_options", "correct_answer")
        read_only_fields = ("id", "type", "correct_answer")

    def get_correct_answer(self, obj):
        try:
            res = requests.get(f"https://api.deezer.com/track/{obj.track}")
            if res.status_code != 200:
                return None
            data = res.json()
            if obj.type == 'author':
                return data["artist"]["name"]
            elif obj.type == 'title':
                return data["title"]
        except:
            pass

        return None

    def validate(self, data):
        track = data.get("track")
        false_options = data.get("false_options", [])
        type_ = self.context.get("challenge_set_category")

        if not track or not false_options or not type_:
            return data

        correct = track.artist if type_ == "author" else track.title
        if correct in false_options:
            raise serializers.ValidationError("A resposta não pode estar entre as alternativas falsas.")
        return data

    def create(self, validated_data):
        false_options = validated_data.pop("false_options")
        validated_data["false_options"] = false_options
        return super().create(validated_data)


class ChallengeSetSerializer(serializers.ModelSerializer):
    challenges = ChallengeSerializer(many=True, required=False)

    class Meta:
        model = ChallengeSet
        fields = ("id", "name", "genre", "category", "created_by", "created_at", "challenges")
        read_only_fields = ("id", "created_by", "created_at")

    def create(self, validated_data):
        challenges_data = validated_data.pop("challenges", [])
        cs = ChallengeSet.objects.create(**validated_data)  # 'created_by' set in perform_create()
        for ch_data in challenges_data:
            if ch_data.get("type") != cs.category:
                raise serializers.ValidationError(
                    f"Challenge type '{ch_data.get('type')}' must match ChallengeSet category '{cs.category}'."
                )
            Challenge.objects.create(challenge_set=cs, **ch_data)
        return cs

    def update(self, instance, validated_data):
        challenges_data = validated_data.pop("challenges", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if challenges_data is not None:
            instance.challenges.all().delete()
            for ch_data in challenges_data:
                if ch_data.get("type") != instance.category:
                    raise serializers.ValidationError(
                        f"Challenge type '{ch_data.get('type')}' must match ChallengeSet category '{instance.category}'."
                    )
                Challenge.objects.create(challenge_set=instance, **ch_data)

        return instance


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ("id", "tittle", "genre", "artist", "preview")
        read_only_fields = ("id", "tittle", "genre", "artist", "preview")

    def create(self, validated_data):
        title = validated_data.pop("title_short")
        genre = validated_data.pop("genre")
        artist = validated_data.pop("artist")
        preview = validated_data.pop("preview")
        validated_data["title"] = title
        validated_data["genre"] = genre
        validated_data["artist"] = artist
        validated_data["preview"] = preview
        
        return super().create(validated_data)

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = ["id", "challenge_set", "score", "is_correct", "submitted_at"]
        read_only_fields = ["id", "submitted_at"]

        def create(self, validated_data):
            return Attempt.objects.create(**validated_data)

class RandomAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = RandomAttempt
        fields = ["id", "track", "score", "tips_used", "submitted_at"]
        read_only_fields = ["id", "submitted_at"]

    def create(self, validated_data):
        return RandomAttempt.objects.create(**validated_data)
