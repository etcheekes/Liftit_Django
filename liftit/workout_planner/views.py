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
from .functions import delete, alter_table
# access models
from .models import Exercises, Default_exercises, User, Users_wk_name, Workout_details


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
                Exercises.objects.create(
                    exercise=default_exercise.default_exercise, 
                    muscle=default_exercise.default_muscle, 
                    equipment=default_exercise.default_equipment, 
                    user_id=user)

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
            return delete(error, request)

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

def browse(request):
    """View function for the browse page of site"""
    # identify user
    user = request.user
    
    # obtain distinct values for muscle and equipment (flat = true returns list of individual values) and order in ascending
    all_muscle = Exercises.objects.filter(user_id__exact=user.id).values_list('muscle', flat=True).distinct().order_by(Lower('muscle'))
    all_equipment = Exercises.objects.filter(user_id__exact=user.id).values_list('equipment', flat=True).distinct().order_by(Lower('equipment'))

    # display chosen exercises 
    muscle_display = request.GET.get("exercises")
    # once muscle group is chosen
    if muscle_display != None:

        reveal_table = 'show'

        category_to_display = Exercises.objects.filter(muscle=muscle_display, user_id=user)

        context = {
            'all_muscle' : all_muscle,
            'all_equipment' : all_equipment,
            'category_to_display' : category_to_display,
            'reveal_table' : reveal_table,
            'muscle_display' : muscle_display,
        }

        return render(request, 'browse.html', context=context)

    # to display exercises by equipment
    equipment_display = request.GET.get("equipments")
    # once equipment group is chosen
    if equipment_display != None:

        reveal_table = 'show'

        category_to_display = Exercises.objects.filter(equipment=equipment_display, user_id=user)

        context = {
            'all_muscle' : all_muscle,
            'all_equipment' : all_equipment,
            'category_to_display' : category_to_display,
            'reveal_table' : reveal_table,
            'equipment_display' : equipment_display,
        }

        return render(request, 'browse.html', context=context)
    
    # to display exercises containing text that the user entered
    exercise_name = request.GET.get("exercise_name")
    # once string is chosen
    if exercise_name != None:
        reveal_table = 'show'

        category_to_display = Exercises.objects.filter(exercise__contains=exercise_name, user_id=user)

        context = {
            'all_muscle' : all_muscle,
            'all_equipment' : all_equipment,
            'category_to_display' : category_to_display,
            'reveal_table' : reveal_table,
        }

        return render(request, 'browse.html', context=context)

    # initial render of page (before user searches)
    context = {
        'all_muscle' : all_muscle,
        'all_equipment' : all_equipment,
    }
    return render(request, 'browse.html', context=context)

def delete_exercise(request):

    # This views serves only to delete exercises from the user's exercise table(deletion is specific to the user logged in)
    if request.method == "POST":

        # identify user
        user = request.user

        # get exercise row to delete
        to_delete = request.POST.get("delete")
        row_to_delete = Exercises.objects.filter(id__exact=to_delete)

        # check if exercise exist in user's personal workout plan, if so then delete (todo)

        # if row exists then delete from exercises table
        if row_to_delete.exists():
            row_to_delete.delete()
        else:
            error = "Exercise is not stored"
            return delete(error, request)

        # obtain distinct categories from user's exercises 
        all_muscle = Exercises.objects.filter(user_id__exact=user.id).values_list('muscle', flat=True).distinct().order_by(Lower('muscle'))
        all_equipment = Exercises.objects.filter(user_id__exact=user.id).values_list('equipment', flat=True).distinct().order_by(Lower('equipment'))

        context = {
            'all_muscle' : all_muscle,
            'all_equipment' : all_equipment,
        }

        return render(request, 'browse.html', context=context)

def manage_workouts(request):
    """View function for manage-workouts page"""
    # identify logged in user
    user = request.user

    # obtain user's named workouts and organise in ascending order (need to put in ascending order)
    user_workouts = Users_wk_name.objects.filter(user__exact=user).order_by('wk_name')

    if request.method == "POST":

        # obtain workout name
        if "wk_name" in request.POST:
            wk_name = request.POST.get("wk_name")
        
            # error handling
            error = None

            if len(wk_name) == 0:
                # if blank name supplied
                error = "Workout name can no be blank"
            elif Users_wk_name.objects.filter(user=user, wk_name=wk_name).exists():
                # if user already has workout with that name
                error = "Workout with that name already exists"

            if error != None:
                return delete(error, request)

            # add to table
            workout_name = Users_wk_name.objects.create(
                wk_name=wk_name,
                user=user
            )

            workout_name.save()

        if "wk_delete" in request.POST:
            wk_delete = request.POST.get("wk_delete")
        
            # INCORPORATE ERROR HANDLING
            if wk_delete == '0':
                error = "please select an existing workout"
                return delete(error, request)

            # remove workout plan name and information from database
            wk_to_delete = Users_wk_name.objects.filter(user=user, wk_name=wk_delete)
            if wk_to_delete.exists():
                wk_to_delete.delete()

            # check if exercise exist in user's personal workout plan, if so then delete (todo)"""

    context = {
        "user_workouts": user_workouts
    }

    return render(request, 'manage-workouts.html', context=context)

def create_exercise(request):
    # identify logged in user
    user = request.user

    if request.method == "POST":
        # obtain excercise information
        store_name = request.POST.get("name_store")
        store_muscle = request.POST.get("muscle_store")
        store_equip = request.POST.get("equip_store")

        # error handling
        error = None

        if len(store_name) == 0 or len(store_muscle) == 0 or len(store_equip) == 0:
            # if any information is missing
            error= "Please fill in all fields"
        elif Exercises.objects.filter(user_id__exact=user.id, exercise=store_name).exists():
            # if exercise name already already exists for the user
            error= "An exercise with that name already exists"
         
        if error != None:
            return delete(error, request)


        # update database with new exercise
        new_exercise = Exercises.objects.create(
            user_id = user,
            exercise = store_name,
            muscle = store_muscle,
            equipment = store_equip
        )

        new_exercise.save()

    # Obtain distinct muscle and equipment categories to display in select option in HTML
    all_muscle = Exercises.objects.filter(user_id__exact=user.id).values_list('muscle', flat=True).distinct().order_by(Lower('muscle'))
    all_equipment = Exercises.objects.filter(user_id__exact=user.id).values_list('equipment', flat=True).distinct().order_by(Lower('equipment'))
   
    context = {
            'equipment': all_equipment,
            'muscle': all_muscle
        }

    return render(request, 'create-exercise.html', context=context)

def customise_workouts(request):

    user = request.user
 
    # obtain user's named workouts
    user_workouts = Users_wk_name.objects.filter(user__exact=user)

    # obtain all exercises available to the user
    all_exercises = Exercises.objects.filter(user_id__exact=user.id)

    context = {
        'user_workouts': user_workouts,
        'all_exercises': all_exercises
    }

    if request.method == "POST":

        # if user chooses to retrieve a workout
        if "wk_plan" in request.POST:

            # obtain user's desired workout
            wk_choice = request.POST.get("wk_plan")

            # Error handling
            error = None
           
            # if user submits a blank
            if wk_choice == '0':
                # user submits a blank
                error = "Please choose a workout plan"
            elif not user_workouts.filter(wk_name__exact=wk_choice).exists():
                # if user submits workout that does not exist
                error = f"Please create workout plan {wk_choice} for customisation."
            
            if error != None:
                 return delete(error, request)

            # data on the user's created workout plan for display in html page
            users_wks = Workout_details.objects.filter(
                track_user = user,
                wk_name=wk_choice
                    # accesss information by linking through the track_ex field which is a foreign key to Exercises table
                    ).select_related(
                        'track_ex'
                    ).values(
                        'track_ex__exercise', 'track_ex__muscle', 'track_ex__equipment', 'wk_name',
                        'reps', 'weight', 'measurement', 'track_row'
                    )
            
            context_add = {
                'users_wks': users_wks,
                'wk_choice': wk_choice,
            }

            # add new variables to bring back
            context.update(context_add)

            # load page
            return render(request, "customise-workouts.html", context=context)


        # if user wishes to add new exercise to a workout plan

        if "wk_plan_add" and "exercise_name" and "reps" and "weight" and "measurement" in request.POST:
            wk_name_add = request.POST.get("wk_plan_add")
            exercise_name = request.POST.get("exercise_name")
            reps = request.POST.get("reps")
            weight = request.POST.get("weight")
            measurement = request.POST.get("measurement")

            # error handling
            error = None

            test = all_exercises.filter(exercise__exact=exercise_name)
            print(test)

            # note wk_name_add returns '0' if workout name is not chosen]
            if len(wk_name_add) == 0 or len(exercise_name) == 0 or len(reps) == 0 or len(weight) == 0 or len(measurement) == 0:
                # throw error if user leaves field empty
                error = 'please fill in all fields'
            elif not all_exercises.filter(exercise__exact=exercise_name).exists():
                # if exercise does not exist
                error = "Exercise not stored, please choose from the suggestions. You can add a new exercise on the Create Exercise page."
            
            if error != None:
                return delete(error, request)

            # obtain unique id for exercise
            ex_track = Exercises.objects.get(exercise=exercise_name, user_id__exact=user.id)
            
            # add exercise to workout_details table
            exercise = Workout_details.objects.create(
            wk_name = wk_name_add,
            reps = reps,
            weight = weight,
            measurement = measurement,
            track_user = user,
            track_ex = ex_track
            )

            exercise.save()

        # if user updates reps, weight, measurement

        if "rep_number" in request.POST:
            alter_table(request, "rep_number", "rep_row", "reps", Workout_details, context)

        if "weight_number" in request.POST:
            alter_table(request, "weight_number", "weight_row", "weight", Workout_details, context)
 
        if "measurement_update" in request.POST:
            alter_table(request, "measurement_update", "measurement_row", "measurement", Workout_details, context)

        # create a function that simplifies all this

    return render(request, "customise-workouts.html", context=context)


def testing(request):
    """View function to testing purposes"""

    return render(request, 'testing.html')