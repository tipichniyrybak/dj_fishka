# Generated by Django 3.0.4 on 2020-04-22 07:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fish_app', '0015_auto_20200417_1906'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='friends',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='requests_for_friendship',
        ),
    ]