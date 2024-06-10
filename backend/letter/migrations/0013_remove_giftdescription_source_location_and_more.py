# Generated by Django 4.2.7 on 2024-04-25 11:51

from django.db import migrations, models


def migrate_source_location_to_page_letter(apps, schema_editor):
    LetterDescription = apps.get_model("letter", "LetterDescription")
    for letter_description in LetterDescription.objects.all():
        if letter_description.source_location:
            letter_description.page = letter_description.source_location
            letter_description.save()


def migrate_page_to_source_location_letter(apps, schema_editor):
    LetterDescription = apps.get_model("letter", "LetterDescription")
    for letter_description in LetterDescription.objects.all():
        if letter_description.page:
            letter_description.source_location = letter_description.page
            letter_description.save()

def migrate_source_location_to_page_gift(apps, schema_editor):
    GiftDescription = apps.get_model("letter", "GiftDescription")
    for gift_description in GiftDescription.objects.all():
        if gift_description.source_location:
            gift_description.page = gift_description.source_location
            gift_description.save()


def migrate_page_to_source_location_gift(apps, schema_editor):
    GiftDescription = apps.get_model("letter", "GiftDescription")
    for gift_description in GiftDescription.objects.all():
        if gift_description.page:
            gift_description.source_location = gift_description.page
            gift_description.save()


class Migration(migrations.Migration):

    dependencies = [
        ("letter", "0012_preservedletter_preservedletterrole_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="giftdescription",
            name="book",
            field=models.CharField(
                blank=True, help_text="The book in the source", max_length=255
            ),
        ),
        migrations.AddField(
            model_name="giftdescription",
            name="chapter",
            field=models.CharField(
                blank=True,
                help_text="The chapter or chapters in the source",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="giftdescription",
            name="page",
            field=models.CharField(
                blank=True,
                help_text="The page number or page range in the source",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="letterdescription",
            name="book",
            field=models.CharField(
                blank=True, help_text="The book in the source", max_length=255
            ),
        ),
        migrations.AddField(
            model_name="letterdescription",
            name="chapter",
            field=models.CharField(
                blank=True,
                help_text="The chapter or chapters in the source",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="letterdescription",
            name="page",
            field=models.CharField(
                blank=True,
                help_text="The page number or page range in the source",
                max_length=255,
            ),
        ),
        migrations.RunPython(
            code=migrate_source_location_to_page_letter,
            reverse_code=migrate_page_to_source_location_letter,
        ),
        migrations.RunPython(
            code=migrate_source_location_to_page_gift,
            reverse_code=migrate_page_to_source_location_gift,
        ),
        migrations.RemoveField(
            model_name="giftdescription",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="letterdescription",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="giftdescriptionaddressee",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="giftdescriptioncategory",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="giftdescriptionsender",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="letterdescriptionaddressee",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="letterdescriptioncategory",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="letterdescriptionsender",
            name="source_location",
        ),
    ]