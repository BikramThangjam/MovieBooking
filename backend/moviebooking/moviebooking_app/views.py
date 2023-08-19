from .models import *
from .serializers import *
from django.http import JsonResponse
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
import json
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.
class SignUpView(APIView):
    def post(self, req):
        data = json.loads(req.body)
        userExist = User.objects.filter(username=data["username"])      
        if not userExist:
            serializer = SignUpSerializer(data=data)
            
            if serializer.is_valid():
                user = serializer.save()
                return JsonResponse({"message": "Account has been created"})
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)       
        return JsonResponse({"message": "Account already exist"}, status=status.HTTP_400_BAD_REQUEST)

class LoginInView(APIView):
    def post(self, req):
        data = json.loads(req.body)  
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                "message": "Login successful!",
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }) 
        return JsonResponse({"message":"Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)
        
        

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, req):
        user = req.user #Only the details of authenticated user will be shown
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)

    def put(self, req):
        user = req.user
        serializer = UserSerializer(user, data=req.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "User details updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, req):
        user = req.user
        user.delete()
        return JsonResponse({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class MovieViews(APIView):
    def get(self, req):
        page_number = req.GET.get("page", 1)
        movies = Movie.objects.all()
        
        paginator = Paginator(movies, 10)
        page = paginator.get_page(page_number)
        movies_pages = page.object_list
        
        serializer = MovieSerializer(movies_pages, many=True)
        return JsonResponse({
            "total_pages": paginator.num_pages,
            "total_products": movies.count(),
            "current_page": page.number,
            "data": serializer.data,
        }, safe=False, status=status.HTTP_200_OK)

class MovieViewAdmin(APIView):
    permission_classes = [IsAdminUser]
        
    def post(self, req):
        data = req.data 
        serializer = MovieSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                "message": "Movie added",
                "data": serializer.data
            }, safe=False, status=status.HTTP_201_CREATED)
        
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        try:
            movie = Movie.objects.get(id=id)
        except Movie.DoesNotExist:
            return JsonResponse({"message": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize request data using MovieSerializer
        serializer = MovieSerializer(movie, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Movie updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, req, id):
        try:
            movie = Movie.objects.get(id=id)
        except Movie.DoesNotExist:
            return JsonResponse({"message":"Movie not found"}, status=status.HTTP_404_NOT_FOUND)
        
        movie.delete()
        return JsonResponse({"message": "Movie deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class MoviesFilterView(APIView):
    def get(self, req):
        genre = req.GET.get('genre',None)
        language = req.GET.get('lan',None)
        city = req.GET.get('city', None)
        rating = req.GET.get('rating',None)
        
        movies = Movie.objects.all()
        
        if genre:
            movies = movies.filter(genre__iexact = genre)
        if language:
            movies = movies.filter(language__iexact = language)
        if city:
            # Get the IDs of movies associated with theaters in the given city
            movie_ids = Theater.objects.filter(city__icontains=city).values_list("movie", flat=True) #returns list of IDs
            movies = movies.filter(id__in=movie_ids)
        if rating:
            movies = movies.filter(rating__iexact = rating)
        
        serializer = MovieSerializer(movies, many=True)
        return JsonResponse(serializer.data, safe=False)
                

class TheaterView(APIView):
    def post(self, req):
        serializer = TheaterSerializer(data=req.data)
        
        if serializer.is_valid():           
            serializer.save()
            return JsonResponse({
                "message": "Theater details successfully added",
                "data": serializer.data
            }, safe=False, status=status.HTTP_201_CREATED)        
        return JsonResponse(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, req):
        theater_list = Theater.objects.all()
        serializer = TheaterSerializer(theater_list, many=True).data
        return JsonResponse(serializer, safe=False, status=status.HTTP_200_OK)
    

class SeatView(APIView):
    #Fetch all seats for a specific movie
    def get(self, req, movie_id):      
        seats = Seat.objects.filter(movie = movie_id)
        serializer = SeatSerializer(seats, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    # def get(self, req):
    #     seats = Seat.objects.all()
    #     serializer = SeatSerializer(seats, many=True)
    #     return JsonResponse(serializer.data, safe=False)
        
        
        