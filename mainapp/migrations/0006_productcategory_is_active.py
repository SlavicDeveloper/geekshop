# Generated by Django 2.2.24 on 2021-11-23 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mainapp", "0005_auto_20211115_1659"),
    ]

    operations = [
        migrations.AddField(
            model_name="productcategory",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="категория активна"),
        ),
    ]
