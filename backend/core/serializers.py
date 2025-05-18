from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import ChallengeSet, Challenge
from django.contrib.auth import get_user_model

User = get_user_model()

class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email")

class UserWriteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name")
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
    class Meta:
        model = Challenge
        fields = ("id", "track", "genre")
        read_only_fields = ("id",)

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
    

