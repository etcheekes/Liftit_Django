# Generated by Django 4.1.6 on 2023-02-10 08:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workout_planner', '0003_default_exercises_exercises'),
    ]

    operations = [
        migrations.CreateModel(
            name='users_wk_name',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wk_name', models.CharField(max_length=120)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
