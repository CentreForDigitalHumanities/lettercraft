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

    def can_edit_source(self, source) -> bool:
        """
        Check if the user can edit the given source.

        Superusers can edit any source, while other users can only edit sources
        in their contributor groups.
        """
        from user.permissions import editable_sources

        editable_source_ids = [source.pk for source in editable_sources(self)]
        return self.is_superuser or source.pk in editable_source_ids


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
