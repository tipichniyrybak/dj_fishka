# Generated by Django 3.0.6 on 2020-07-15 06:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fish_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ifish',
            name='description',
            field=models.TextField(default='fish_description', verbose_name='description'),
        ),
        migrations.AddField(
            model_name='ifish',
            name='fishing_style',
            field=models.TextField(default='fishing_style', verbose_name='fishing_style'),
        ),
    ]