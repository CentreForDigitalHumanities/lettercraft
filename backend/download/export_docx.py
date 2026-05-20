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

    if contributors := data["contributors"]:
        document.add_paragraph(
            f"Contributors: {", ".join(contributors)}"
        )

    if description := data["description"]:
        document.add_paragraph(description)

    for episode in data["episodes"]:
        _add_episode(episode, data, document)


def _add_episode(data: Dict, source_data: Dict, document: DocumentObject) -> None:
    document.add_heading(data["name"], level=2)

    if source_ref := _episode_source_ref(data["source_reference"]):
        document.add_paragraph(source_ref)

    if summary := data["summary"]:
        document.add_paragraph(summary)

    if labels := data["labels"]:
        document.add_paragraph(
            f"Labels: {", ".join(labels)}"
        )

    if designators := data["designators"]:
        document.add_paragraph(
            f"Designators: {", ".join(designators)}",
        )

    for key in ["agents", "letters", "gifts", "locations"]:
        _add_episode_entities(data, source_data, key, document)


def _episode_source_ref(data: Dict) -> str:
    keys = ["book", "chapter", "page"]
    parts = [
        f"{key} {data[key]}"
        for key in keys
        if data[key] is not None
    ]
    return ", ".join(parts).capitalize()


def _add_episode_entities(episode_data: Dict, source_data: Dict, key: str, document: DocumentObject):
    if entities := _episode_entity_names(episode_data, source_data, key):
        document.add_paragraph(
            f"{key}: {entities}".capitalize()
        )


def _episode_entity_names(episode_data: Dict, source_data: Dict, key: str):
    ids = episode_data[key]
    all_entities = source_data[key]
    entities = [
        next(entity for entity in all_entities if entity["id"] == entity_id)
        for entity_id in ids
    ]
    names = [entity["name"] for entity in entities]
    return ", ".join(names)
