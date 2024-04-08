from django.db import models
from event import models as event_models
from person import models as person_models
from space import models as space_models


class Episode(models.Model):
    """
    An episode is a collection of epistolary events
    """

    name = models.CharField(
        max_length=256,
    )
    description = models.TextField(
        blank=True,
    )
    event_descriptions = models.ManyToManyField(
        to=event_models.EventDescription,
        blank=True,
        related_name="episodes",
    )

    def __str__(self):
        return self.name


class CaseStudy(models.Model):
    """
    A case study is an overarching collection research data, bound together by a common theme, e.g. `The Saga of St. Boniface` or `The  Nun Rebellion of Poitiers`.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"

    name = models.CharField(
        max_length=256,
        unique=True,
    )
    description = models.TextField(blank=True)

    key_figures = models.ManyToManyField(
        to=person_models.Person,
        limit_choices_to={"identifiable": True},
        blank=True,
        related_name="case_studies",
        help_text="historical figures central to this case study",
    )

    key_sites = models.ManyToManyField(
        to=space_models.Structure,
        limit_choices_to={"identifiable": True},
        blank=True,
        related_name="case_studies",
        help_text="historical sites central to this case study",
    )

    episodes = models.ManyToManyField(
        to=Episode,
        blank=True,
        related_name="case_studies",
        help_text="episodes that are part of this case study",
    )

    def __str__(self):
        return self.name
