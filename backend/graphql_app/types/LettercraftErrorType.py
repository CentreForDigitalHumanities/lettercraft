from typing import List
from graphene_django.types import ErrorType


class LettercraftErrorType(ErrorType):
    """
    A simple wrapper around Graphene-Django's ErrorType with a constructor.
    """

    def __init__(self, field: str, messages: List[str]):
        super().__init__()
        self.field = field
        self.messages = messages
