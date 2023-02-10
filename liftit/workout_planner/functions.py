from django.shortcuts import render


def delete(error_message, request):
    context = {
        'error': error_message,
        'store_url': request.get_full_path()
    }
    
    return render(request, 'error.html', context=context)
