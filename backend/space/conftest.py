import pytest

from . import models


@pytest.fixture
def region(db):
    return models.Region.objects.create(
        name="Muppetopia",
    )


@pytest.fixture
def settlement(db, region):
    settlement = models.Settlement.objects.create(
        name="Muppet town",
    )
    settlement.regions.add(region)
    return settlement


@pytest.fixture
def structure(db, settlement):
    structure = models.Structure.objects.create(
        name="Bert and Ernie's house", level=models.Structure.LevelOptions.BUILDING
    )
    structure.settlement = settlement
    structure.save()
    return structure
