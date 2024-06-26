from django.db import models
from core.models import Named
from event.models import Series
from person.models import HistoricalPerson
from space.models import Structure


class CaseStudy(Named, models.Model):
    """
    A case study is an overarching collection of series, bound together by a common theme, e.g. `The Saga of St. Boniface` or `The Nun Rebellion of Poitiers`.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"

    series = models.ManyToManyField(
        to=Series,
        blank=True,
        help_text="Series involved in this case study",
    )

    key_persons = models.ManyToManyField(
        to=HistoricalPerson,
        blank=True,
        help_text="Key historical figures involved in this case study",
    )

    key_sites = models.ManyToManyField(
        to=Structure,
        blank=True,
        help_text="Key historical sites involved in this case study",
    )

    def __str__(self):
        return self.name
