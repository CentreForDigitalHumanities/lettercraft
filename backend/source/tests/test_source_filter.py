import pytest
from source.models import Source
from source.types.SourceType import SourceFilter

@pytest.fixture()
def no_missing_source(db):
    Source.objects.get(name='MISSING SOURCE').delete()

@pytest.fixture()
def source_2(db):
    return Source.objects.create(
        name='Pat & Mat',
        description_text='Shenanigans from two clumsy neighbours'
    )

@pytest.mark.parametrize('query,expected', [
        ('', ['Sesame Street', 'Pat & Mat']),
        ('Street', ['Sesame Street']),
        ('street', ['Sesame Street']),
        ('clumsy', ['Pat & Mat']),
        ('street sesame', ['Sesame Street']),
        ('pat clumsy', ['Pat & Mat']),
        ('nonsense', []),
])
def test_source_search(source, source_2, no_missing_source, query, expected):
    filter = SourceFilter(Source.objects.all())
    result = filter.search_sources(
        Source.objects.all(),
        '',
        query
    )
    assert set(source.name for source in result) == set(expected)
