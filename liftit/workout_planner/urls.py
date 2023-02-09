from django.urls import path
from . import views

urlpatterns = [
    # blank string indicates root of website
    path('', views.home, name='home'), #name='home' gives a relative URL pattern to link to
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('testing/', views.testing, name='testing'),
    path('error/', views.error, name='error'),
]