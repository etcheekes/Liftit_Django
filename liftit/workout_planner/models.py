from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

# define User table a custom user table to make any future possible customization easier
class User(AbstractUser):
    # create field
    pass

    def __str__(self):
        return self.username

# default exercises to transfer into user's exercises table upon their first login
class Default_exercises(models.Model):

    # fields
    default_id = models.BigAutoField(primary_key=True)
    default_exercise = models.CharField(max_length=120)
    default_muscle = models.CharField(max_length=120)
    default_equipment = models.CharField(max_length=120)


    def __str__(self):
    # String for representing the Model object.
        return self.default_exercise

    def get_absolute_url(self):
        # Returns the URL to access a detail record for this exercise
        print("todo: input URL pattern name once created")
        #return reverse('URL pattern name', args=[str(self.id_user)])

class Exercises(models.Model):

    # fields
    exercise = models.CharField(max_length=120)
    muscle = models.CharField(max_length=120)
    equipment = models.CharField(max_length=120)
    # if user account is deleted or removed, then remove all records associated with that account (on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

# store named workouts

class Users_wk_name(models.Model):

    #fields
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    wk_name = models.CharField(max_length=120)

# store exercises

class Workout_details(models.Model):

    # fields
    track_row = models.BigAutoField(primary_key=True)
    track_user = models.ForeignKey(User, on_delete=models.CASCADE)
    wk_name = models.CharField(max_length=120)
    track_ex = models.ForeignKey(Exercises, on_delete=models.CASCADE)
    reps = models.IntegerField()
    weight = models.IntegerField()
    measurement = models.CharField(max_length=120)