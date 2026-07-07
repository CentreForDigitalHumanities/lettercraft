from rest_framework.serializers import ModelSerializer

from glossary import models

class GlossaryItemSerializer(ModelSerializer):
    class Meta:
        model = models.GlossaryItem
        fields = '__all__'


class GlossaryReferenceSerializer(ModelSerializer):
    class Meta:
        model = models.GlossaryReference
        fields = '__all__'
