# Generated by Django 4.1.6 on 2023-02-10 15:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workout_planner', '0004_users_wk_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Workout_details',
            fields=[
                ('track_row', models.BigAutoField(primary_key=True, serialize=False)),
                ('wk_name', models.CharField(max_length=120)),
                ('reps', models.IntegerField()),
                ('weight', models.IntegerField()),
                ('measurement', models.CharField(max_length=120)),
                ('track_ex', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workout_planner.exercises')),
                ('track_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
