from typing import Dict
from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from django.urls import reverse

from user.models import User

def picture_url(user: User):
    return reverse("user picture", kwargs={"id": user.pk})

class ProfilePictureField(serializers.URLField):
    def to_representation(self, value):
        if value:
            return picture_url(value.instance.user)


class CustomUserDetailsSerializer(UserDetailsSerializer):
    description = serializers.CharField(source="profile.description")
    public_role = serializers.CharField(source="profile.role", read_only=True)
    picture = ProfilePictureField(source="profile.picture", read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        is_staff = serializers.BooleanField(read_only=True)
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_contributor",
            "description",
            "public_role",
            "picture",
        )
        read_only_fields = ["is_staff", "id", "email", "is_contributor"]

    def validate_username(self, value):
        # pass validation if user submits their current name
        if self.instance and self.instance.username == value:
            return value
        return super().validate_username(value)


    def update(self, instance: User, validated_data: Dict):
        if 'profile' in validated_data:
            value = validated_data.pop('profile').get('description')
            instance.profile.description = value
            instance.profile.save()

        return super().update(instance, validated_data)
