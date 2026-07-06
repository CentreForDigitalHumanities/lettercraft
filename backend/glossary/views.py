from rest_framework.viewsets import ReadOnlyModelViewSet

from glossary import serializers, models

class GlossaryItemViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.GlossaryItemSerializer
    queryset = models.GlossaryItem.objects.all()


class GlossaryReferenceViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.GlossaryReferenceSerializer
    queryset = models.GlossaryReference.objects.all()
