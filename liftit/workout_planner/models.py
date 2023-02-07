from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

# define User table a custom user table to make any future possible customization easier
class User(AbstractUser):
    # create field
    pass

    def __str__(self):
        return self.username