import django.contrib.auth.models as django_auth_models
from django.db import models


class User(django_auth_models.AbstractUser):
    """
    Core user model that is used for authentication.
    """

    # Only extend this model with information that is relevant for
    # authentication; things like settings and preferences should be
    # added to the UserProfile instead.

    class Meta:
        db_table = "auth_user"


class UserProfile(models.Model):
    """
    User information that is not relevant to authentication.
    E.g. settings, preferences, optional personal information.
    """

    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    def __str__(self):
        return f"Profile of {self.user}"
