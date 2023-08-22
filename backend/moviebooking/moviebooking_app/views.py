from .models import *
from .serializers import *
from django.db.models import Sum
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

class MoviesView(APIView):
    def get(self, req):
        page_number = req.GET.get("page", 1)
        movies = Movie.objects.all().order_by('id')
        
        paginator = Paginator(movies, 10)
        page = paginator.get_page(page_number)
        movies_pages = page.object_list
        
        serializer = MovieSerializer(movies_pages, many=True)
        return JsonResponse({
            "total_pages": paginator.num_pages,
            "total_movies": movies.count(),
            "current_page": page.number,
            "data": serializer.data,
        }, safe=False, status=status.HTTP_200_OK)
        
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

class MoviesFilterByCategory(APIView):
    def get(self, req):
        cat = req.GET.get('cat')
        page_no = req.GET.get('page', 1)
        
        movies = Movie.objects.filter(category__icontains=cat)
        
        paginator = Paginator(movies, 10)
        page = paginator.get_page(page_no)
        movies_pages = page.object_list
        
        
        serializer = MovieSerializer(movies_pages, many=True)
        return JsonResponse({
            "total_pages": paginator.num_pages,
            "total_movies": movies.count(),
            "current_page": page.number,
            "data": serializer.data,
        }, safe=False, status=status.HTTP_200_OK)              

class MoviesFilterByTitle(APIView):
    def get(self, req):
        title = req.GET.get('title')
        movies = Movie.objects.filter(title__icontains = title)
        serializer = MovieSerializer(movies, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
    
class MovieDetailsView(APIView):
    def get(self, req, movie_id):
        try:
            movie = Movie.objects.get(id = movie_id)
            serializer = MovieSerializer(movie)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return JsonResponse({"message":"Movie not found"}, status=status.HTTP_404_NOT_FOUND)
            

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
    
class TheatersMovieView(APIView):
    def get(self,req, movie_id):
        allTheaters = Theater.objects.filter(movie=movie_id)
        serializer = TheaterSerializer(allTheaters, many=True)
        return JsonResponse(serializer.data,safe=False, status=status.HTTP_200_OK)

# Fetch all the seats of a specific theater and movie
class SeatsTheaterMovieView(APIView):
    def post(self, req):
        data = req.data
        allSeats = Seat.objects.filter(theater=data['theater_id'], movie=data['movie_id'])
        serializer = SeatSerializer(allSeats, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)    
    

class SeatView(APIView):
    permission_classes = [IsAdminUser]
    #Fetch all seats for a specific movie
    def get(self, req, movie_id):      
        seats = Seat.objects.filter(movie = movie_id)
        serializer = SeatSerializer(seats, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    # Reserve a seat
    def post(self, req):
        data = req.data
        
        # Check if the required fields are present in the request data
        required_fields = ["theater_id", "movie_id", "seat_no"]
        for field in required_fields:
            if field not in data:
                return JsonResponse({"message": f"'{field}' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            seat = Seat.objects.get(theater=data["theater_id"], movie=data["movie_id"], seat_no=data["seat_no"])
            
            if seat.is_reserved:
                return JsonResponse({"message": "Seat is already reserved"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set the seat as reserved and save the changes
            seat.is_reserved = True
            seat.save()
            
            serializer = SeatSerializer(seat)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        
        except Seat.DoesNotExist:
            return JsonResponse({"message": "Seat not found"}, status=status.HTTP_404_NOT_FOUND)
         
    # update seat reservation   
    def put(self, req, seat_id):
        
        try:
            seat = Seat.objects.get(id=seat_id)
            
            # Check if the seat is reserved
            if not seat.is_reserved:
                return JsonResponse({"message": "Seat is not reserved"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Toggle the seat reservation status and save the changes
            seat.is_reserved = not seat.is_reserved
            seat.save()
            
            serializer = SeatSerializer(seat)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        
        except Seat.DoesNotExist:
            return JsonResponse({"message": "Seat not found"}, status=status.HTTP_404_NOT_FOUND)

class SeatAdminView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, req):
        data = req.data
        serializer = SeatSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_201_CREATED) 
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
    def put(self, req, id=None):
        try:
            selected_seat = Seat.objects.get(id=id)
        except Seat.DoesNotExist:
            return JsonResponse({'message':'Seat not found'}, safe=False, status=status.HTTP_404_NOT_FOUND)  
        
        serializer = SeatSerializer(selected_seat, data=req.data) 
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, req, id=None):
        try:
            selected_seat = Seat.objects.get(id=id)
            selected_seat.delete()
        except Seat.DoesNotExist:
             return JsonResponse({'message':'Seat not found'}, safe=False, status=status.HTTP_404_NOT_FOUND) 


class TicketView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, req):
        user = req.user
        booked_tickets = Ticket.objects.filter(user=user)
        serializer = TicketSerializer(booked_tickets, many=True)
        return JsonResponse(serializer.data,safe=False, status=status.HTTP_200_OK)

    def post(self, req):
        data = req.data
        
        movie = data.get("movie")
        seat = data.get("seat")
        # category = data.get("category")
        # price = data.get("price")

        if not all([movie, seat]):
            return JsonResponse({"message": "Incomplete ticket data"}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
        selected_seat = Seat.objects.filter(id = seat)[0]
        print("selected_seat---",selected_seat)
        data['user']= req.user.id
        data['category'] = selected_seat.category
        data['price'] = selected_seat.price
        serializer = TicketSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)
                
class BookingsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, req):
        bookings = Booking.objects.filter(user=req.user.id).select_related('movie')
        serializer = BookingSerializer(bookings, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
    
    
class BookingView(APIView):
    permission_classes = [IsAuthenticated]
    
    #If a booking_id is provided, it retrieves details for a specific booking. If no booking_id is provided, it retrieves a list of bookings related to the logged-in user
    def get(self, req, booking_id):
        try:
            booking = Booking.objects.get(user=req.user.id, id=booking_id)
            serializer = BookingSerializer(booking)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return JsonResponse({'message': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
           
    def post(self, req):
        data = req.data

        # Assuming 'seats' is a list of seat IDs selected for booking
        seats = data.get('seats', [])

        # Check if the selected seats are available and not already reserved
        selected_seats = Seat.objects.filter(id__in=seats)
        is_reserved_seats = selected_seats.filter(is_reserved__in = [True]).exists()
        if is_reserved_seats:
            return JsonResponse({'message':'Some seats are already reserved.'}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
        data['user'] = req.user.id
        total_price = selected_seats.aggregate(sum = Sum('price'))['sum']# Calculate total cost based on selected seats' prices
        data['total_price'] = total_price
        
        serializer = BookingSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            Seat.objects.filter(id__in=seats).update(is_reserved=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_201_CREATED)            
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, req, booking_id):
        try:
            booking = Booking.objects.get(id = booking_id, user=req.user.id)
            reserved_seats = booking.seats.values_list('id', flat=True)
            Seat.objects.filter(id__in=list(reserved_seats)).update(is_reserved=False)
            booking.delete()
            return JsonResponse({'message': 'Booking has been cancelled'},safe=False, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return JsonResponse({'message': 'Booking does not exist'}, safe=False, status=status.HTTP_404_NOT_FOUND)  
        
        