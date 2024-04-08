from django.db import models


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

    def __str__(self):
        return self.name


class Episode(models.Model):
    """
    An episode is a collection of epistolary events
    """

    name = models.CharField(
        max_length=256,
    )

    description = models.TextField(blank=True)

    case_studies = models.ManyToManyField(to=CaseStudy, related_name="episodes")

    def __str__(self):
        return self.name
