import pytest
from django.core.exceptions import ValidationError


def test_validate_structure_correct_hierarchy(road_structure, building_structure):
    building_structure.parent = road_structure
    building_structure.save()
    building_structure.clean()


def test_validate_structure_incorrect_hierarchy(road_structure, building_structure):
    road_structure.parent = building_structure
    road_structure.save()
    with pytest.raises(ValidationError) as e:
        road_structure.clean()

    message = e.value.args[0]
    assert (
        message
        == "Cannot add a structure of level 1 (road, square, crossroad) as a child to a structure of level 3 (building, vessel)"
    )
