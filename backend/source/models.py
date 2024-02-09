from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


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

class Reference(models.Model):
    """
    References link information to sources.

    A Reference describes where and how a source refers to the information presented
    in the database object.
    """

    # reference to the object
    # c.f. https://docs.djangoproject.com/en/4.2/ref/contrib/contenttypes/#generic-relations

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    # reference to a source

    source = models.ForeignKey(
        to=Source,
        on_delete=models.CASCADE,
        help_text="the source text in which this references occurs",
    )

    # description of the reference

    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="specific location of the reference in the source text",
    )

    terminology = ArrayField(
        models.CharField(
            max_length=200,
        ),
        default=[],
        blank=True,
        size=5,
        help_text="terminology used in the source text to describe this entity",
    )

    mention = models.CharField(
        max_length=32,
        blank=True,
        choices=[("direct", "directly mentioned"), ("implied", "implied")],
        help_text="how is this entity presented in the text?",
    )

    class Meta:
        indexes = [models.Index(fields=["content_type", "object_id"])]
