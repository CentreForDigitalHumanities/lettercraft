from django.db import models
from core.models import LettercraftDate


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

    medieval_title = models.CharField(
        max_length=255, blank=True, help_text="The original title of the work, if known"
    )

    medieval_author = models.CharField(
        max_length=255,
        blank=True,
        help_text="The name of the original author of the work, if known",
    )

    edition_title = models.CharField(
        max_length=255,
        blank=True,
        help_text="The title of the edition used for this source",
    )

    edition_author = models.CharField(
        max_length=255, blank=True, help_text="The name of the author of the edition"
    )

    def __str__(self):
        return self.name


class SourceWrittenDate(LettercraftDate):
    """
    Specifies the date (or date range) when a source was written.
    """

    source = models.OneToOneField(
        Source,
        on_delete=models.CASCADE,
        related_name="written_date",
        help_text="The source that was written at this date",
    )

    def __str__(self) -> str:
        return f"{self.source} was written in {self.display_date}"


class SourceContentsDate(LettercraftDate):
    """
    Specifies the date (or date range) when the events described in a source took place.
    """

    source = models.OneToOneField(
        Source,
        on_delete=models.CASCADE,
        related_name="contents_date",
        help_text="The source whose events took place at this date",
    )

    def __str__(self) -> str:
        return f"The events of {self.source} take place in {self.display_date}"
