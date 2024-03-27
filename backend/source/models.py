from django.db import models


class Source(models.Model):
    """
    A Source is a text of any kind.
    """

    name = models.CharField(
        max_length=200,
        blank=False,
        unique=True,
        help_text="a unique name to identify this source in the database",
    )

    bibliographical_info = models.TextField(
        blank=True, help_text="bibliographical information to identify this source"
    )

    def __str__(self):
        return self.name
