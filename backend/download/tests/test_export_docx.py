from source.models import Source
from download.export_json import json_data
from download.export_docx import save_docx
from docx import Document


def test_export_docx(tmp_path, source: Source, episode, episode_2, episode_attribution):
    path = tmp_path / "data.docx"
    qs = Source.objects.filter(pk=source.pk)
    data = json_data(qs)
    with open(path, "wb") as f:
        save_docx(data, f)

    with open(path, 'rb') as f:
        doc = Document(f)
        assert doc
