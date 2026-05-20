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

    document.add_heading("Episodes", level=2)
    for episode in data["episodes"]:
        _add_episode(episode, data, document)

    document.add_heading("Agents", level=2)
    for agent in data["agents"]:
        _add_agent(agent, document)

    for key in ["letters", "gifts", "locations"]:
        document.add_heading(key.capitalize(), level=2)
        for agent in data[key]:
            _add_entity(agent, document)


def _add_episode(data: Dict, source_data: Dict, document: DocumentObject) -> None:
    document.add_heading(data["name"], level=3)

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
        if entities := _episode_entity_names(data, source_data, key):
            document.add_paragraph()
            document.add_paragraph(
                f"{key}: {entities}".capitalize()
            )


def _episode_source_ref(data: Dict) -> str:
    keys = ["book", "chapter", "page"]
    parts = [
        f"{key} {data[key]}"
        for key in keys
        if data[key] is not None
    ]
    return ", ".join(parts).capitalize()


def _episode_entity_names(episode_data: Dict, source_data: Dict, key: str):
    ids = episode_data[key]
    all_entities = source_data[key]
    entities = [
        next(entity for entity in all_entities if entity["id"] == entity_id)
        for entity_id in ids
    ]
    names = [entity["name"] for entity in entities]
    return ", ".join(names)


def _add_agent(data: Dict, document: DocumentObject):
    p = document.add_paragraph(style="List Bullet")
    name = p.add_run(data["name"])
    if data["is_group"]:
        name.add_text(" [group]")
    name.add_text(". ")

    description = p.add_run(data["description"])
    description.italic = True


def _add_entity(data: Dict, document: DocumentObject):
    p = document.add_paragraph(style="List Bullet")
    p.add_run(data["name"] + ". ")

    description = p.add_run(data["description"])
    description.italic = True
