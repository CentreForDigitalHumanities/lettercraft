from io import TextIOWrapper
from typing import Dict

from django.db.models import QuerySet
from docx import Document
from docx.document import Document as DocumentObject

from source.models import Source
from download.export_json import json_data


def save_docx(sources: QuerySet[Source], out: TextIOWrapper) -> None:
    data = json_data(sources)

    document = Document()
    _add_preamble(document)
    for source in data['sources']:
        _add_source(source, document)

    document.save(out)


def _add_preamble(document: DocumentObject) -> None:
    document.add_heading("Lettercraft data")


def _add_source(data: Dict, document: DocumentObject) -> None:
    document.add_page_break()
    document.add_heading(data["name"])

    if len(data["contributors"]):
        document.add_paragraph(
            f"Contributors: {", ".join(data["contributors"])}"
        )

    if data["description"]:
        document.add_paragraph(data["description"])

    for episode in data["episodes"]:
        _add_episode(episode, document)


def _add_episode(data: Dict, document: DocumentObject) -> None:
    document.add_heading(data["name"], level=2)

    source_ref = _episode_source_ref(data["source_reference"])
    if source_ref:
        document.add_paragraph(source_ref)

    document.add_paragraph(data["summary"])
    if len(data["designators"]):
        document.add_paragraph(
            f"Designators: {", ".join(data["designators"])}",
        )


def _episode_source_ref(data: Dict) -> str:
    keys = ["book", "chapter", "page"]
    parts = [
        f"{key} {data[key]}"
        for key in keys
        if data[key] is not None
    ]
    return ", ".join(parts).capitalize()
