from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from user.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile

    fields = {}

class CustomUserDetailsSerializer(UserDetailsSerializer):
    profile = UserProfileSerializer()

    class Meta(UserDetailsSerializer.Meta):
        is_staff = serializers.BooleanField(read_only=True)
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "profile",
        )

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        if profile_data:
            profile_serializer = UserProfileSerializer()
            profile_serializer.update(instance.profile, profile_data)

        return super().update(instance, validated_data)
