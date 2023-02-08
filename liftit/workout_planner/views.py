from django.shortcuts import render
# redirect user to login URL (defined in the project settings file) if attemping to access a page reserved for logged in users 
from django.contrib.auth.decorators import login_required
# roll back any database changes if an error occurs
from django.db import transaction
# access models
from .models import Exercises, Default_exercises, User

@transaction.atomic
def home(request):
    """View function for home page of site."""

    # if user is logged in and their unique id is not in the id column of users table then fill exercises table with exercises + users unique id
    if request.user.is_authenticated:

        # identify user
        user = request.user
        num = user.id
        # check if user was given default exercises (find first row with that user's id)
        exercise_check = Exercises.objects.filter(id__contains=user.id).first()
        if (exercise_check == None):
            # if no exercises found place Default_exercises values into exercises model
            for default_exercise in Default_exercises.objects.all():
                Exercises.objects.create(exercise=default_exercise.default_exercise, muscle=default_exercise.default_muscle, equipment=default_exercise.default_equipment, user_id=user)

    return render(request, 'home.html')

def register(request):
    """View function for register page of site."""
    return render(request, 'register.html')

def login(request):
    """View function for login page of site"""
    return render(request, 'login.html')

def testing(request):
    """View function to testing purposes"""
    exercises = "testing"

    context = {
        'exercises' : exercises,
    }
    return render(request, 'testing.html', context=context)