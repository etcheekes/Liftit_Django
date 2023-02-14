from django.contrib import admin
from django.contrib.auth.admin import UserAdmin # for custom user table
from .models import User, Default_exercises, Exercises

# Register your models here.

admin.site.register(User, UserAdmin)

@admin.register(Default_exercises)
class Default_exercises(admin.ModelAdmin):
    # in admin view, display these columns from the Default_exercises model
    list_display = ('default_id', 'default_exercise', 'default_muscle', 'default_equipment')
    search_fields = ('default_exercise',)

@admin.register(Exercises)
class Exercises(admin.ModelAdmin):
    list_display = ('id', 'exercise', 'muscle', 'equipment')
    search_fields = ('exercise',)