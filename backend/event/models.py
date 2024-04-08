from django.db import models

from core.models import DescriptionField, LettercraftDate, SourceDescription
from person.models import AgentDescription
from letter.models import GiftDescription, LetterDescription
from space.models import SpaceDescription


class EventDescription(SourceDescription, models.Model):
    """
    A passage describing an epistolary event
    """

    actors = models.ManyToManyField(
        to=AgentDescription,
        through="EventDescriptionAgent",
        related_name="events",
        help_text="agents involved in this event",
    )
    letters = models.ManyToManyField(
        to=LetterDescription,
        related_name="events",
        help_text="letters involved in this event",
    )
    gifts = models.ManyToManyField(
        to=GiftDescription,
        related_name="events",
        help_text="gifts involved in this event",
    )
    spaces = models.ManyToManyField(
        to=SpaceDescription,
        related_name="events",
        help_text="spaces involved in this event",
    )


class EventDescriptionDate(DescriptionField, LettercraftDate, models.Model):
    """
    A date included in the description of an event
    """

    event = models.ForeignKey(
        to=EventDescription, on_delete=models.CASCADE, related_name="date"
    )

    def __str__(self):
        return f"{self.letter_action} ({self.display_date})"


class EventDescriptionAgent(DescriptionField, models.Model):
    """
    Describes the involvement of an agent in an epistolary event description.
    """

    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )
    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"role of {self.agent} in {self.event}"


class EventDescriptionLetter(DescriptionField, models.Model):
    """
    Describes the involvement of a letter in an epistolary event description.
    """

    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
        null=False,
    )
    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
        null=False,
    )


class EventDescriptionGift(DescriptionField, models.Model):
    """
    Describes the involvement of a gift in an epistolary event description.
    """

    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
        null=False,
    )
    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
        null=False,
    )


class EventDescriptionSpace(DescriptionField, models.Model):
    """
    Describes the involvement of a location in an epistolary event description.
    """

    space = models.ForeignKey(
        to=SpaceDescription,
        on_delete=models.CASCADE,
        null=False,
    )
    event = models.ForeignKey(
        to=EventDescription,
        on_delete=models.CASCADE,
        null=False,
    )
