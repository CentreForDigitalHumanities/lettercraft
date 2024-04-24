from django.db import models
from django.core.exceptions import ValidationError

from core.models import EntityDescription, DescriptionField, Named
from person.models import AgentDescription
from letter.models import GiftDescription, LetterDescription
from space.models import SpaceDescription


class EventCategory(Named):
    class Meta:
        verbose_name_plural = "event categories"


class EventDescription(EntityDescription, models.Model):
    """
    An epistolary event described in as source text
    """

    summary = models.TextField(
        blank=True,
        help_text="full description of the events in the passage",
    )
    categories = models.ManyToManyField(
        to=EventCategory,
        related_name="event_descriptions",
        help_text="labels assigned to this event",
    )
    agents = models.ManyToManyField(
        to=AgentDescription,
        through="EventDescriptionAgent",
        blank=True,
        help_text="agents involved in this event",
    )
    gifts = models.ManyToManyField(
        to=GiftDescription,
        through="EventDescriptionGift",
        blank=True,
        help_text="gifts involved in this event",
    )
    letters = models.ManyToManyField(
        to=LetterDescription,
        through="EventDescriptionLetter",
        blank=True,
        help_text="letters involved in this event",
    )
    spaces = models.ManyToManyField(
        to=SpaceDescription,
        through="EventDescriptionSpace",
        blank=True,
        help_text="locations involved in this event",
    )


class EventDescriptionAgent(DescriptionField, models.Model):
    """
    Relationship between an agent and an event described in a source text
    """

    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.event.source != self.agent.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return f"{self.agent.name} / {self.event}"


class EventDescriptionGift(DescriptionField, models.Model):
    """
    Relationship between an agent and an gift described in a source text
    """

    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
    )
    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.event.source != self.gift.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return f"{self.gift.name} / {self.event}"


class EventDescriptionLetter(DescriptionField, models.Model):
    """
    Relationship between an agent and a letter described in a source text
    """

    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
    )
    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.event.source != self.letter.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return f"{self.letter.name} / {self.event}"


class EventDescriptionSpace(DescriptionField, models.Model):
    """
    Relationship between an agent and a space described in a source text
    """

    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
    )
    space = models.ForeignKey(
        to=SpaceDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.event.source != self.space.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return f"{self.space.name} / {self.event}"


class Episode(Named, models.Model):
    """
    A higher abstraction of events into connected "episodes"
    """

    events = models.ManyToManyField(
        to=EventDescription,
        blank=True,
        help_text="Events that make up this episode",
    )
