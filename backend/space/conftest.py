import pytest

from . import models


@pytest.fixture
def road_structure(db):
    return models.Structure.objects.create(
        name="Sesame Street", level=models.Structure.LevelOptions.ROAD
    )


@pytest.fixture
def building_structure(db):
    return models.Structure.objects.create(
        name="Bert and Ernie's house", level=models.Structure.LevelOptions.BUILDING
    )
