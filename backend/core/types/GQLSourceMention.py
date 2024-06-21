from graphene import Enum

from core.models import SourceMention


GQLSourceMention = Enum.from_enum(SourceMention)
