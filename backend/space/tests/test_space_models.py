import pytest

from space import models


@pytest.fixture
def test_models(db, region, settlement, structure):
    assert region
    assert settlement
    assert structure
