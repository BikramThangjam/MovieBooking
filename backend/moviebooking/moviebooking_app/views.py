from .models import *
from .serializers import *
from django.db.models import Sum
from django.http import JsonResponse
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password # securely hash the password
import json

# Create your views here.
class SignUpView(APIView):
    def post(self, req):
        userExist = User.objects.filter(username=req.data["username"])      
        if not userExist:
            serializer = SignUpSerializer(data=req.data)
            
            if serializer.is_valid():
                user = serializer.save()
                return JsonResponse({"message": "Account has been created"}, safe=False, status=200)
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)       
        return JsonResponse({"message": "Account already exist!"}, status=status.HTTP_400_BAD_REQUEST)

class LoginInView(APIView):
    def post(self, req):
        data = json.loads(req.body)  
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)

            # print("username--", user)
            user_data = User.objects.get(username = user)
            return JsonResponse({
                "message": "Login successful!",
                "data": {
                    "user_id": user_data.id,
                    "username": user_data.username,
                    "email": user_data.email,
                    "is_staff": user_data.is_staff,
                    "is_superuser": user_data.is_superuser
                },
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }) 
        return JsonResponse({"message":"Incorrect username or password!"}, status=status.HTTP_400_BAD_REQUEST)
        
        

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

            if 'password' in req.data:
                new_password = req.data['password']
                # print("new_password -- ",new_password)
                hashed_password = make_password(new_password)
                # print("hashed_password -- ",hashed_password)
                serializer.validated_data['password'] = hashed_password
                # print("validated_password--",serializer.validated_data['password']) 

            serializer.save()
            return JsonResponse({"message": "User details updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        
        return JsonResponse({'message': serializer.errors}, safe=False, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, req):
        user = req.user
        user.delete()
        return JsonResponse({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class UserAdminView(APIView):
    permission_classes = [IsAdminUser] 

    def get(self, req):
        try:
            username = req.GET.get('username', None)
            user = User.objects.get(username = username)
            serializer = UserSerializer(user)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, req, user_id):
        try:
            user = User.objects.get(id = user_id)
            serializer = UserSerializer(user, data=req.data, partial=True)

            if serializer.is_valid():

                if 'password' in req.data:
                    new_password = req.data['password']
                    hashed_password = make_password(new_password)
                    serializer.validated_data['password'] = hashed_password

                serializer.save()
                return JsonResponse({"message": "User details updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)            
            return JsonResponse({'message': serializer.errors}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, req, user_id):
        try:
            user = User.objects.get(id = user_id)
            user.delete()
            return JsonResponse({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return JsonResponse({"message":"User not found"}, safe=False, status=status.HTTP_404_NOT_FOUND)



class RefreshTokenView(APIView):
    def post(self, req):
        refresh_token = req.data.get("refresh")
        if not refresh_token:
            return JsonResponse({"message": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh_token = RefreshToken(refresh_token)
            access_token = refresh_token.access_token
        except Exception as e:
            return JsonResponse({"message": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        return JsonResponse({"access":str(access_token)}, status=status.HTTP_200_OK)


class GenresView(APIView):
    def get(self, req):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

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
        title = req.GET.get('title',None)
        genre = req.GET.get('genre',None)
        language = req.GET.get('lan',None)
        city = req.GET.get('city', None)
        rating = req.GET.get('rating',None)
        page_number = req.GET.get("page", 1)
        
        movies = Movie.objects.all()
        
        if title:
            movies = movies.filter(title__icontains = title)
        if genre:
            genre_ids = Genre.objects.filter(name__icontains=genre).values_list("id", flat=True)
            movies = movies.filter(genre__in=genre_ids)
        if language:
            movies = movies.filter(language__iexact = language)
        if city:
            # Get the IDs of movies associated with theaters in the given city
            movie_ids = Theater.objects.filter(city__icontains=city).values_list("movie", flat=True) #returns list of IDs
            movies = movies.filter(id__in=movie_ids)
        if rating:
            movies = movies.filter(rating__iexact = rating)
        
        paginator = Paginator(movies, 14)
        page = paginator.get_page(page_number)
        movies_pages = page.object_list

        serializer = MovieSerializer(movies_pages, many=True)
        return JsonResponse({
            "total_pages": paginator.num_pages,
            "total_movies": movies.count(),
            "current_page": page.number,
            "data": serializer.data,
        }, safe=False, status=status.HTTP_200_OK)

class MoviesFilterByCategory(APIView):
    def get(self, req):
        cat = req.GET.get('cat')
        page_no = req.GET.get('page', 1)
        
        movies = Movie.objects.filter(category__icontains=cat)
        
        paginator = Paginator(movies, 20)
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
        page_number = req.GET.get("page", 1)

        movies = Movie.objects.all()
        if title:
            movies = movies.filter(title__icontains = title)

        paginator = Paginator(movies, 14)
        page = paginator.get_page(page_number)
        movies_pages = page.object_list
       
        serializer = MovieSerializer(movies_pages, many=True)
        return JsonResponse({
            "total_pages": paginator.num_pages,
            "total_movies": movies.count(),
            "current_page": page.number,
            "data": serializer.data,
        }, safe=False, status=status.HTTP_200_OK)

class MovieDetailsView(APIView):
    def get(self, req, id):
        try:
            movie = Movie.objects.get(id = id)
            serializer = MovieSerializer(movie)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return JsonResponse({"message":"Movie not found"}, status=status.HTTP_404_NOT_FOUND)

    
class MovieDetailsByTitleView(APIView):
    def get(self, req):
        title = req.GET.get('title', None)
        try:
            movie = Movie.objects.get(title__icontains = title)
            serializer = MovieSerializer(movie)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return JsonResponse({"message":"Movie not found"}, status=status.HTTP_404_NOT_FOUND)
            

class MovieViewAdmin(APIView):
    permission_classes = [IsAdminUser]      

    def post(self, request):
        data = request.data
        genre_ids = data.get('genre', [])
        genres = Genre.objects.filter(id__in=genre_ids)
        if len(genres) != len(genre_ids):
            return JsonResponse({"message": "One or more genres not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = MovieSerializer(data=data)       
        if serializer.is_valid():
            movie = serializer.save()
            # Assign the retrieved genres to the movie
            movie.genre.set(genres)
            return JsonResponse({
                "message": "Movie added",
                "data": MovieSerializer(movie).data  # Serialize the movie data
            }, status=status.HTTP_201_CREATED)
        
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        try:
            movie = Movie.objects.get(id=id)
        except Movie.DoesNotExist:
            return JsonResponse({"message": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        print("req data--", request.data)

        # Deserialize request data using MovieSerializer
        serializer = MovieSerializer(movie, data=request.data,  partial=True)

        if serializer.is_valid():
            # Check if 'genre' data is provided in the request
            if 'genre' in request.data:
                # Clear existing genre associations and add the new ones
                movie.genre.clear()
                genre_data = request.data.get('genre', [])
                for genre_id in genre_data:
                    movie.genre.add(genre_id)
            serializer.save()
            return JsonResponse({"message": "Movie updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, req, id):
        try:
            movie = Movie.objects.get(id=id)
        except Movie.DoesNotExist:
            return JsonResponse({"message":"Movie not found"}, status=status.HTTP_404_NOT_FOUND)
        
        movie.delete()
        return JsonResponse({"message": "Movie has been deleted"}, status=status.HTTP_204_NO_CONTENT)

class BulkCreateMovieView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        movies_data = request.data

        # Validate and create movies
        serializer = MovieSerializer(data=movies_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                "message": "Movie added",
                "data": serializer.data
            }, safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)  
    
class TheaterView(APIView):
    def get(self, req):
        theater_list = Theater.objects.all()
        serializer = TheaterSerializer(theater_list, many=True).data
        return JsonResponse(serializer, safe=False, status=status.HTTP_200_OK)

class TheatersByTitleView(APIView):
    def get(self, req):
        theater_name = req.GET.get('name', None)
        try:
            theater = Theater.objects.filter(name__icontains = theater_name)
            serializer = TheaterSerializer(theater, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Theater.DoesNotExist:
            return JsonResponse({"message":"Theater not found"}, status=status.HTTP_404_NOT_FOUND)

    
class TheaterViewAdmin(APIView):
    permission_classes = [IsAdminUser]
    def get(self, req, id):
        try:
            theater = Theater.objects.get(id = id)
            serializer = TheaterSerializer(theater)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"message": "Theater not found"}, safe=False, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, req):
        serializer = TheaterSerializer(data=req.data)
        
        if serializer.is_valid():           
            serializer.save()
            return JsonResponse({
                "message": "Theater details successfully added",
                "data": serializer.data
            }, safe=False, status=status.HTTP_201_CREATED)        
        return JsonResponse(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        try:
            theater = Theater.objects.get(id=id)
        except Theater.DoesNotExist:
            return JsonResponse({"message": "Theater not found."}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize request data using MovieSerializer
        serializer = TheaterSerializer(theater, data=request.data,  partial=True)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Theater details updated successfully."}, status=status.HTTP_200_OK)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, req, id):
        try:
            theater = Theater.objects.get(id=id)
        except theater.DoesNotExist:
            return JsonResponse({"message":"Theater not found"}, status=status.HTTP_404_NOT_FOUND)
        
        theater.delete()
        return JsonResponse({"message": "Theater has been deleted"}, status=status.HTTP_204_NO_CONTENT)

    
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
    def get(self, req, seat_id): 
        try:               
            seat = Seat.objects.get(id = seat_id)
            serializer = SeatSerializer(seat)
            return JsonResponse(serializer.data, safe=False)
        except Seat.DoesNotExist:
            return JsonResponse({"message": "Seat not found"}, status=status.HTTP_404_NOT_FOUND) 
    
    # Reserve a seat
    # def post(self, req):
    #     data = req.data
        
    #     # Check if the required fields are present in the request data
    #     required_fields = ["theater_id", "movie_id", "seat_no"]
    #     for field in required_fields:
    #         if field not in data:
    #             return JsonResponse({"message": f"'{field}' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    #     try:
    #         seat = Seat.objects.get(theater=data["theater_id"], movie=data["movie_id"], seat_no=data["seat_no"])
            
    #         if seat.is_reserved:
    #             return JsonResponse({"message": "Seat is already reserved"}, status=status.HTTP_400_BAD_REQUEST)
            
    #         # Set the seat as reserved and save the changes
    #         seat.is_reserved = True
    #         seat.save()
            
    #         serializer = SeatSerializer(seat)
    #         return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        
    #     except Seat.DoesNotExist:
    #         return JsonResponse({"message": "Seat not found"}, status=status.HTTP_404_NOT_FOUND)
         
    # # update seat reservation   
    # def put(self, req, seat_id):
        
    #     try:
    #         seat = Seat.objects.get(id=seat_id)
            
    #         # Check if the seat is reserved
    #         if not seat.is_reserved:
    #             return JsonResponse({"message": "Seat is not reserved"}, status=status.HTTP_400_BAD_REQUEST)
            
    #         # Toggle the seat reservation status and save the changes
    #         seat.is_reserved = not seat.is_reserved
    #         seat.save()
            
    #         serializer = SeatSerializer(seat)
    #         return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        
    #     except Seat.DoesNotExist:
    #         return JsonResponse({"message": "Seat not found"}, status=status.HTTP_404_NOT_FOUND)

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
            return JsonResponse({
                "message": "Seat details have been updated",
                "data": serializer.data
            }, safe=False, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, req, id=None):
        try:
            selected_seat = Seat.objects.get(id=id)
            selected_seat.delete()
        except Seat.DoesNotExist:
             return JsonResponse({'message':'Seat not found'}, safe=False, status=status.HTTP_404_NOT_FOUND) 


# class TicketView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, req):
#         user = req.user
#         booked_tickets = Ticket.objects.filter(user=user)
#         serializer = TicketSerializer(booked_tickets, many=True)
#         return JsonResponse(serializer.data,safe=False, status=status.HTTP_200_OK)

#     def post(self, req):
#         data = req.data
        
#         movie = data.get("movie")
#         seat = data.get("seat")
#         # category = data.get("category")
#         # price = data.get("price")

#         if not all([movie, seat]):
#             return JsonResponse({"message": "Incomplete ticket data"}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
#         selected_seat = Seat.objects.filter(id = seat)[0]
#         print("selected_seat---",selected_seat)
#         data['user']= req.user.id
#         data['category'] = selected_seat.category
#         data['price'] = selected_seat.price
#         serializer = TicketSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
#         return JsonResponse(serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)
                
# class BookingsView(APIView):
#     permission_classes = [IsAdminUser]
#     def get(self, req):
#         bookings = Booking.objects.filter(user=req.user.id).select_related('movie')
#         serializer = BookingSerializer(bookings, many=True)
#         return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
    
    
class BookingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, req, booking_id=None):
        if not booking_id:
            bookings = Booking.objects.filter(user=req.user.id)
            serializer = BookingSerializer(bookings, many=True)
            response_data = []
            for booking in serializer.data:
                # for retrieving movie name
                movie_id = booking['movie']
                movie = Movie.objects.get(id=movie_id)
                movie_name = movie.title

                #For retrieving seats_nos, theater_name and  start_at
                seat_ids = booking['seats']  # Get the list of seat IDs
                selected_seats = Seat.objects.filter(id__in = seat_ids).values_list("seat_no", flat=True)           
                booking['seats_nos'] = list(selected_seats)

                seat_id = seat_ids[0]  # Assuming the first seat is representative of all seats
                seat = Seat.objects.get(id=seat_id)
                theater_name = seat.theater.name
                start_at = seat.theater.movie_timing
                

                booking_data = {
                    'id': booking['id'],
                    'user': booking['user'],
                    'movie_name': movie_name,
                    'theater_name': theater_name,
                    'seats': booking['seats_nos'],
                    'start_at': start_at,
                    'total_cost': booking['total_cost'],
                    'created_at': booking['created_at'],
                }

                response_data.append(booking_data)
            return JsonResponse(response_data, safe=False, status = status.HTTP_200_OK)
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

        selected_seats = Seat.objects.filter(id__in=seats)
                
        data['user'] = req.user.id
        total_price = selected_seats.aggregate(sum = Sum('price'))['sum']# Calculate total cost based on selected seats' prices
        data['total_cost'] = total_price
        
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
        

    