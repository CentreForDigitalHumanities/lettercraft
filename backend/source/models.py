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
        max_length=255, blank=True, help_text="The original (Latin) title of the work",
    )

    reference = models.TextField(
        verbose_name='bibliographical reference',
        blank=True,
        help_text="Bibliographical reference to the text",
    )

    description = models.TextField(
        blank=True,
        help_text="Background information about the text",
    )

    is_public = models.BooleanField(
        default=False,
        help_text="Whether this source is available in the browsing interface or not.",
    )


    def __str__(self):
        return self.name


class SourceImage(models.Model):
    '''
    Image to be shown on a source page
    '''

    source = models.ForeignKey(
        to=Source,
        related_name='images',
        on_delete=models.CASCADE,
    )

    image = models.ImageField(
        upload_to='source_images/',
        help_text="Image to be displayed on the source page",
    )

    image_alt = models.CharField(
        max_length=256,
        verbose_name="Text alternative for image",
        help_text="Brief description of the image contents; shown when the image cannot be displayed",
    )

    image_caption = models.CharField(
        max_length=256,
        help_text="Image caption; shown below the image",
    )


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
