from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=60)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=16)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'username'
    objects = UserManager()
    
    def __str__(self):
        return self.username

#for admin    
class Movie(models.Model):
    title = models.CharField(max_length=250)
    director = models.CharField(max_length=250)
    genre = models.CharField(max_length=250)
    language = models.CharField(max_length=250)
    rating = models.CharField(max_length=10)
    image = models.TextField()
    movie_length = models.IntegerField
    
    def __str__(self):
        return self.title
#for admin    
class Theater(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=250)
    pincode = models.CharField(max_length=10)
    movie_timing = models.DateField()
    
    def __str__(self):
        return self.name
#for admin
class Seat(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seat_no = models.CharField(max_length=10)
    is_reserved = models.BooleanField(default=False)
    category = models.CharField(max_length=250)
    price = models.FloatField(default=0.00)
    
    def __str__(self):
        return f"{self.theater.name} - {self.movie.title} -  Seat {self.seat_no}"
    
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_cost = models.FloatField(default=0.00)
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"
    