from django.db import migrations


def save_settlement_structures_as_settlement(apps, schema_editor):
    Structure = apps.get_model("space", "Structure")
    Settlement = apps.get_model("space", "Settlement")
    StructureField = apps.get_model("space", "StructureField")
    SettlementField = apps.get_model("space", "SettlementField")

    for structure in Structure.objects.filter(level=0):

        settlement = Settlement.objects.create(
            name=structure.name,
            description=structure.description,
            identifiable=structure.identifiable,
        )

        descendants = Structure.objects.filter(parent=structure).union(
            Structure.objects.filter(parent__parent=structure),
            Structure.objects.filter(parent__parent__parent=structure),
            Structure.objects.filter(parent__parent__parent__parent=structure),
            Structure.objects.filter(parent__parent__parent__parent__parent=structure),
        )

        for child in descendants:
            child.settlement = settlement
            if child.parent == structure:
                child.parent = None
            child.save()

        for relation in StructureField.objects.filter(structure=structure):
            SettlementField.objects.create(
                space=relation.space,
                settlement=settlement,
                source_mention=relation.source_mention,
                note=relation.note,
            )

        structure.delete()


def save_settlements_as_settlement_structures(apps, schema_editor):
    Structure = apps.get_model("space", "Structure")
    Settlement = apps.get_model("space", "Settlement")
    StructureField = apps.get_model("space", "StructureField")
    SettlementField = apps.get_model("space", "SettlementField")

    for settlement in Settlement.objects.all():
        structure = Structure.objects.create(
            name=settlement.name,
            description=settlement.description,
            identifiable=settlement.identifiable,
            level=0,
        )

        for child in Structure.objects.filter(settlement=settlement):
            if not child.parent:
                child.settlement = None
                child.parent = structure
                child.save()

        for relation in SettlementField.objects.filter(settlement=settlement):
            StructureField.objects.create(
                space=relation.space,
                structure=structure,
                source_mention=relation.source_mention,
                note=relation.note,
            )

        settlement.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("space", "0012_settlement"),
    ]

    operations = [
        migrations.RunPython(
            save_settlement_structures_as_settlement,
            reverse_code=save_settlements_as_settlement_structures,
        ),
    ]
