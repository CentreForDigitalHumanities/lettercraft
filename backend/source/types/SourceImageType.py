from graphene_django import DjangoObjectType
from graphene import NonNull, ResolveInfo, String
from django.urls import reverse

from source.models import SourceImage

class SourceImageType(DjangoObjectType):
    url = NonNull(String)

    class Meta:
        model = SourceImage
        fields = ["id", "source", "alt_text", "caption"]

    @staticmethod
    def resolve_url(parent: SourceImage, info: ResolveInfo):
        return reverse('source-image', args=(parent.source.pk,))
