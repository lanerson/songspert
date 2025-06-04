from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import ChallengeSet, Challenge, Track
from django.contrib.auth import get_user_model
import requests

User = get_user_model()

class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "daily_points", "weekly_points", "monthly_points", "profile_picture")

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
    type = serializers.CharField()

    class Meta:
        model = Challenge
        fields = ("id", "track", "genre", "type", "false_options", "correct_answer")
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
                return data["title"].split(" (")[0]
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
        fields = ("id", "name", "category", "created_by", "created_at", "challenges")
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




