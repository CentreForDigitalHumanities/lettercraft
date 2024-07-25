# Generated by Django 4.2.7 on 2024-07-11 06:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("letter", "0016_rename_category_lettercategory"),
    ]

    operations = [
        migrations.AlterField(
            model_name="giftdescriptioncategory",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="categorisations",
                to="letter.giftcategory",
            ),
        ),
        migrations.AlterField(
            model_name="giftdescriptioncategory",
            name="gift",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="categorisations",
                to="letter.giftdescription",
            ),
        ),
        migrations.AlterField(
            model_name="letterdescriptioncategory",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="categorisations",
                to="letter.lettercategory",
            ),
        ),
        migrations.AlterField(
            model_name="letterdescriptioncategory",
            name="letter",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="categorisations",
                to="letter.letterdescription",
            ),
        ),
    ]