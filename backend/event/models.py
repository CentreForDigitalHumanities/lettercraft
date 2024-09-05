from django.db import models
from django.core.exceptions import ValidationError
from core.models import EntityDescription, DescriptionField, Named
from person.models import AgentDescription
from letter.models import GiftDescription, LetterDescription
from space.models import SpaceDescription


class EpisodeCategory(Named):
    class Meta:
        verbose_name_plural = "episode categories"


class Episode(EntityDescription, models.Model):
    """
    An episode described in a source text
    """

    summary = models.TextField(
        blank=True,
        help_text="full description of the events in the passage",
    )
    categories = models.ManyToManyField(
        to=EpisodeCategory,
        related_name="episodes",
        help_text="labels assigned to this episode",
        blank=True,
    )
    agents = models.ManyToManyField(
        to=AgentDescription,
        through="EpisodeAgent",
        blank=True,
        help_text="agents involved in this episode",
    )
    gifts = models.ManyToManyField(
        to=GiftDescription,
        through="EpisodeGift",
        blank=True,
        help_text="gifts involved in this episode",
    )
    letters = models.ManyToManyField(
        to=LetterDescription,
        through="EpisodeLetter",
        blank=True,
        help_text="letters involved in this episode",
    )
    spaces = models.ManyToManyField(
        to=SpaceDescription,
        through="EpisodeSpace",
        blank=True,
        help_text="locations involved in this episode",
    )


class EpisodeEntity(DescriptionField, models.Model):
    """
    Relationship between an episode and an entity described in a source text

    Child classes should set:
    - a ForeignKey relation to AgentDescription/GiftDescription/etc
    - `entity_field` with the name of this field in the model class
    """

    class Meta:
        abstract = True

    entity_field = None

    episode = models.ForeignKey(
        to=Episode,
        on_delete=models.CASCADE,
    )

    @property
    def entity(self) -> EntityDescription:
        entity_field = getattr(self, "entity_field")
        return getattr(self, entity_field)

    def clean(self):
        if self.episode.source != self.entity.source:
            raise ValidationError(
                "Can only link episodes and entities in the same source text"
            )

    def __str__(self):
        return f"{self.entity.name} / {self.episode}"


class EpisodeAgent(EpisodeEntity, models.Model):
    """
    Relationship between an episode and an agent described in a source text
    """

    entity_field = "agent"

    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )


class EpisodeGift(EpisodeEntity, models.Model):
    """
    Relationship between an episode and a gift described in a source text
    """

    entity_field = "gift"

    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )


class EpisodeLetter(EpisodeEntity, models.Model):
    """
    Relationship between an episode and a letter described in a source text
    """

    entity_field = "letter"

    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )


class EpisodeSpace(EpisodeEntity, models.Model):
    """
    Relationship between an episode and a space described in a source text
    """

    entity_field = "space"

    space = models.ForeignKey(
        to=SpaceDescription,
        on_delete=models.CASCADE,
    )


class Series(Named, models.Model):
    """
    A set of connected "episodes".
    """

    episodes = models.ManyToManyField(
        to=Episode,
        blank=True,
        help_text="Episodes that make up this series",
    )

    class Meta:
        verbose_name_plural = "series"
