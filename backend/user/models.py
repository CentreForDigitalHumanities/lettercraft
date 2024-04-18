import django.contrib.auth.models as django_auth_models
from django.db import models


class User(django_auth_models.AbstractUser):
    """
    Core user model that is used for authentication.
    """

    class Meta:
        db_table = "auth_user"
