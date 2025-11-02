from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken


# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=150,null=True, blank=True, unique=True)
    email = models.EmailField(max_length=100,unique=True, db_index=True)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    Gender_choices = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]   
    gender = models.CharField(max_length=10, choices=Gender_choices, null=True, blank=True) 

    is_authorized = models.BooleanField(default=False)

    def __str__(self):
        return self.username 
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
        

