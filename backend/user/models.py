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
    def is_contributor(self) -> bool:
        """
        Whether this user has been granted permission to contribute to the project.

        This is true iff the user is a superuser or the user is a member of a contributor
        group.
        """

        return self.is_superuser or self.contributor_groups.exists()


class ContributorGroup(models.Model):
    name = models.CharField(
        max_length=128,
    )
    users = models.ManyToManyField(
        to=User,
        related_name="contributor_groups",
        blank=True,
    )
    sources = models.ManyToManyField(
        to="source.Source",
        related_name="contributor_groups",
        blank=True,
    )

    def __str__(self):
        return self.name
