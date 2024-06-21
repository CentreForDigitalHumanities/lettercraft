from graphene import List, ObjectType, ResolveInfo, String

from core.models import EntityDescription, Field
from core.types.GQLSourceMention import GQLSourceMention
from core.types.NamedType import NamedType
from source.types.SourceType import SourceType


class EntityDescriptionType(NamedType, ObjectType):
    """
    Type for models that extend the EntityDescription model.
    Should not be queried directly, but should be extended by other types.
    """

    source = Field(SourceType, required=True)
    source_mention = GQLSourceMention()
    designators = List(String, required=True)
    book = String()
    chapter = String()
    page = String()

    @staticmethod
    def fields() -> list[str]:
        return [
            "certainty",
            "note",
            "designators",
            "book",
            "chapter",
            "page",
        ] + NamedType.fields()

    @staticmethod
    def resolve_source(parent: EntityDescription, info: ResolveInfo) -> SourceType:
        return parent.source

    @staticmethod
    def resolve_source_mention(parent: EntityDescription, info: ResolveInfo) -> str:
        return parent.source_mention

    @staticmethod
    def resolve_designators(parent: EntityDescription, info: ResolveInfo) -> list[str]:
        return parent.designators

    @staticmethod
    def resolve_book(parent: EntityDescription, info: ResolveInfo) -> str:
        return parent.book

    @staticmethod
    def resolve_chapter(parent: EntityDescription, info: ResolveInfo) -> str:
        return parent.chapter

    @staticmethod
    def resolve_page(parent: EntityDescription, info: ResolveInfo) -> str:
        return parent.page
