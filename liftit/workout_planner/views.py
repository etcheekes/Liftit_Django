from django.shortcuts import render
# redirect user to login URL (defined in the project settings file) if attemping to access a page reserved for logged in users 
from django.contrib.auth.decorators import login_required
# roll back any database changes if an error occurs
from django.db import transaction
# function for case insensitive re-ordering
from django.db.models.functions import Lower
# for hashing passwords
from django.contrib.auth.hashers import make_password
# redirect to other URL
from django.shortcuts import redirect
# access models
from .models import Exercises, Default_exercises, User

@transaction.atomic
def home(request):
    """View function for home page of site."""

    # if user is logged in and their unique id is not in the id column of users table then fill exercises table with exercises + users unique id
    if request.user.is_authenticated:

        # identify user
        user = request.user
        check = user.id
        # check if user was given default exercises (find first row with that user's id)
        exercise_check = Exercises.objects.filter(user_id=check).first()
        if (exercise_check == None):
            # if no exercises found place Default_exercises values into exercises model
            for default_exercise in Default_exercises.objects.all():
                Exercises.objects.create(exercise=default_exercise.default_exercise, muscle=default_exercise.default_muscle, equipment=default_exercise.default_equipment, user_id=user)

    return render(request, 'home.html')

def register(request):
    """View function for register page of site."""


    if request.method == 'POST':
        
        # obtain user details
        username = request.POST.get('username')
        password = request.POST.get('password')
        password_confirm = request.POST.get('confirmation')

        # check for user entry errors 
        error = None

        if not username:
            error = "Must provide a username"
        elif not password:
            error = "Must provide a passsword"
        elif not password_confirm:
            error = "Must confirm password"
        elif password != password_confirm:
            error = "Both passwords must be the same"
        elif User.objects.filter(username__exact = username).exists(): # check if username already exists
            error = "Username already exists"
        
        # Display error message if error occurred
        if error:
            context = {
                'error': error,
                'store_url': request.get_full_path()
                }     
            return render(request, 'error.html', context=context)

        # hash password
        hashed_password = make_password(password)

        # place user information into User model/table
        user = User.objects.create(
            username=username,
            password=hashed_password
        )

        # save object to table
        user.save()
        
        # redirect to login page
        return redirect('login')
        
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

def error(request):
    """View function for displaying a customised error message"""

    return render(request, 'error.html')