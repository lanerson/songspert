from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import ChallengeSet, Challenge
from django.contrib.auth import get_user_model

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
    type = serializers.ChoiceField(choices=['author', 'title'])
    false_options = serializers.ListField(
        child=serializers.CharField(),
        min_length=3,
        max_length=3,
        write_only=True
    )
    correct_answer = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Challenge
        fields = ("id", "track", "genre", "type", "false_options", "correct_answer")
        read_only_fields = ("id", "correct_answer")

    def get_correct_answer(self, obj):
        if obj.type == 'author':
            return obj.track.artist
        elif obj.type == 'title':
            return obj.track.title
        return None

    def validate(self, data):
        track = data.get("track")
        type_ = data.get("type")
        false_options = data.get("false_options", [])

        if not track or not type_ or not false_options:
            return data
        
        correct =  track.artist if type_ == "author" else track.title
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
        fields = ("id", "name", "created_at", "challenges")
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        challenges_data = validated_data.pop("challenges", [])
        cs = ChallengeSet.objects.create(
            created_by=self.context["request"].user,
            **validated_data
        )
        for ch_data in challenges_data:
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
                Challenge.objects.create(challenge_set=instance, **ch_data)

        return instance
    

