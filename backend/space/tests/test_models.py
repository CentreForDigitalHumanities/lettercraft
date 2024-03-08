import pytest

from space import models


@pytest.fixture
def room_structure(db):
    return models.Structure.objects.create(
        name="Ernie's room", level=models.Structure.LevelOptions.ROOM
    )


@pytest.fixture
def room_structure_2(db):
    return models.Structure.objects.create(
        name="Bert's room", level=models.Structure.LevelOptions.ROOM
    )


@pytest.fixture
def spot_structure(db):
    return models.Structure.objects.create(
        name="Ernie's desk", level=models.Structure.LevelOptions.SPOT
    )


@pytest.fixture
def structure_tree(
    road_structure, building_structure, room_structure, room_structure_2, spot_structure
):
    spot_structure.parent = room_structure
    spot_structure.save()

    room_structure.parent = building_structure
    room_structure.save()

    room_structure_2.parent = building_structure
    room_structure_2.save()

    building_structure.parent = road_structure
    building_structure.save()


def test_structure_ancestors(
    spot_structure, room_structure, building_structure, road_structure, structure_tree
):
    assert spot_structure.ancestors == [
        room_structure,
        building_structure,
        road_structure,
    ]


def test_structure_descendants(
    road_structure,
    building_structure,
    room_structure,
    room_structure_2,
    spot_structure,
    structure_tree,
):
    assert road_structure.descendants == [
        building_structure,
        room_structure,
        spot_structure,
        room_structure_2,
    ]
