import django.contrib.auth.models as django_auth_models
from django.db import models


class User(django_auth_models.AbstractUser):
    """
    Core user model that is used for authentication.
    """

    # Only extend this model with information that is relevant for
    # authentication; for things like settings and preferences, add
    # a UserProfile model

    class Meta:
        db_table = "auth_user"

    @property
    def is_contributor_alt(self) -> bool:
        """
        Whether this user has been granted permission to contribute to the project.

        This is true iff the user has been added to at least one source text (through
        group membership).
        """

        return self.groups.filter(sources__isnull=False).exists()
