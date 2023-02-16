from django.shortcuts import render

# error handling
def delete(error_message, request):
    context = {
        'error': error_message,
        'store_url': request.get_full_path()
    }
    
    return render(request, 'error.html', context=context)

# altering reps, weight, or measurement in backend database

def alter_table(request, row_value, row_identifier, field_name, table, context):

     if row_value in request.POST:

        # get value to change and identify row to change
        update = request.POST.get(row_value) 
        row_id = request.POST.get(row_identifier)

        # update value in user_workouts table
        table.objects.filter(track_row=row_id).update(**{field_name: update}) # **{field_name: update} converts string into keyword arguments 
