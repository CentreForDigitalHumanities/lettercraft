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


class EpisodeAgent(DescriptionField, models.Model):
    """
    Relationship between an episode and an agent described in a source text
    """

    episode = models.ForeignKey(
        to=Episode,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.episode.source != self.agent.source:
            raise ValidationError("Can only link episodes and agents in the same source text")

    def __str__(self):
        return f"{self.agent.name} / {self.episode}"


class EpisodeGift(DescriptionField, models.Model):
    """
    Relationship between an episode and a gift described in a source text
    """

    episode = models.ForeignKey(
        to=Episode,
        on_delete=models.CASCADE,
    )
    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.episode.source != self.gift.source:
            raise ValidationError("Can only link episodes and gifts in the same source text")

    def __str__(self):
        return f"{self.gift.name} / {self.episode}"


class EpisodeLetter(DescriptionField, models.Model):
    """
    Relationship between an episode and a letter described in a source text
    """

    episode = models.ForeignKey(
        to=Episode,
        on_delete=models.CASCADE,
    )
    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.episode.source != self.letter.source:
            raise ValidationError("Can only link episodes and letters in the same source text")

    def __str__(self):
        return f"{self.letter.name} / {self.episode}"


class EpisodeSpace(DescriptionField, models.Model):
    """
    Relationship between an episode and a space described in a source text
    """

    episode = models.ForeignKey(
        to=Episode,
        on_delete=models.CASCADE,
    )
    space = models.ForeignKey(
        to=SpaceDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.episode.source != self.space.source:
            raise ValidationError("Can only link episodes and spaces in the same source text")

    def __str__(self):
        return f"{self.space.name} / {self.episode}"


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
