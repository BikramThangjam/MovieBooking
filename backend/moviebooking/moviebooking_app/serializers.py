from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'username', 'password', 'is_active', 'is_staff', 'is_superuser']
        
class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username","password","email","name", "is_staff","is_superuser"]
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'], 
            password=validated_data['password'],
            email= validated_data['email'],
            name = validated_data['name'],
            is_staff = validated_data['is_staff'],
            is_superuser = validated_data['is_superuser'],
                        
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid username or password")

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"


class MovieSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(many=True, read_only=True)
    class Meta:
        model = Movie
        fields = "__all__"

class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = "__all__"

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = "__all__"

# class TicketSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Ticket
#         fields = "__all__"
        
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
    