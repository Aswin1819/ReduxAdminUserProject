from django.contrib.auth.models import AbstractUser
from django.db import models
import cloudinary
import cloudinary.uploader
import cloudinary.models

class CustomUser(AbstractUser):
    profile_image = cloudinary.models.CloudinaryField('image', blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    
    class Meta:
        swappable = 'AUTH_USER_MODEL'


    def __str__(self):
        return self.username
