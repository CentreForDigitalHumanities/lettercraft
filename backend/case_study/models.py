from django.db import models


class CaseStudy(models.Model):
    """
    A case study is an overarching collection of epistolary events, bound together by a common theme, e.g. `The Saga of St. Boniface` or `The  Nun Rebellion of Poitiers`.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"

    name = models.CharField(
        max_length=256,
        null=False,
        blank=False,
    )

    def __str__(self):
        return self.name
