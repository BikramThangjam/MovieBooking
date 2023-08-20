from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=60)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=16)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'username'
    objects = UserManager()
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
    
    def __str__(self):
        return self.username

#for admin    
class Movie(models.Model):
    category= models.CharField(max_length=250)
    title = models.CharField(max_length=250)
    description = models.TextField()
    genre = models.CharField(max_length=250)
    language = models.CharField(max_length=250)
    rating = models.CharField(max_length=10)
    image = models.TextField()
    movie_length = models.IntegerField()

    def __str__(self):
        return self.title
#for admin    
class Theater(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=250)
    pincode = models.CharField(max_length=10)
    movie_timing = models.DateTimeField()
    
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
    
class Ticket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    category = models.CharField(max_length=250)
    price = models.FloatField(default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket for {self.movie.title} - Seat {self.seat.seat_no}"
    
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_cost = models.FloatField(default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"
    