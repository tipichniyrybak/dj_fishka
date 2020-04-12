# Generated by Django 3.0.5 on 2020-04-12 20:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fish_app', '0005_friendship'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(default='', max_length=255)),
                ('status', models.CharField(choices=[('RD', 'READ'), ('UR', 'UNREAD')], default='UR', max_length=255)),
                ('user_receive', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_receive', to=settings.AUTH_USER_MODEL)),
                ('user_send', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_send', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]