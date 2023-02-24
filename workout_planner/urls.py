from django.urls import path
from . import views

urlpatterns = [
    # blank string indicates root of website
    path('', views.home, name='home'), #name='home' gives a relative URL pattern to link to
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('error/', views.error, name='error'),
    path('browse/', views.browse, name='browse'),
    path('delete_exercise_from_database/', views.delete_exercise, name='delete_exercise_from_database'),
    path('manage-workouts', views.manage_workouts, name='manage-workouts'),
    path('create-exercise', views.create_exercise, name="create-exercise"),
    path('customise-workouts', views.customise_workouts, name="customise-workouts"),
    path('get_last_user_created_row/', views.get_last_user_created_row, name="get_last_user_created_row"),
    path('account/', views.account_management, name="account"),
    ]