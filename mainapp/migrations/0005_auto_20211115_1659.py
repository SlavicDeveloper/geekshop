# Generated by Django 2.2.24 on 2021-11-15 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0004_fill_db'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='address',
            field=models.CharField(max_length=254, verbose_name='адресс'),
        ),
    ]
