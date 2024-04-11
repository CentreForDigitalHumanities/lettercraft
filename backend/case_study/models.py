from django.db import models
from core.models import Named
from event.models import EventDescription


class CaseStudy(Named, models.Model):
    """
    A case study is an overarching collection of epistolary events, bound together by a common theme, e.g. `The Saga of St. Boniface` or `The  Nun Rebellion of Poitiers`.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"

    episodes = models.ManyToManyField(
        to="Episode",
        blank=True,
        help_text="Episodes involved in this case study",
    )

    def __str__(self):
        return self.name


class Episode(Named, models.Model):
    """
    A higher abstraction of events into connected "episodes"
    """

    events = models.ManyToManyField(
        to=EventDescription,
        blank=True,
        help_text="Events that make up this episode",
    )
