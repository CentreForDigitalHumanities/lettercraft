from source.models import Source
from download.export_docx import save_docx


def test_export_json(tmp_path, source: Source, episode, episode_2, episode_attribution):
    path = tmp_path / "data.docx"
    qs = Source.objects.filter(pk=source.pk)
    with open(path, "wb") as f:
        save_docx(qs, f)
