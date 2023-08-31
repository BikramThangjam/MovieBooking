from django.urls import path
from .views import *

urlpatterns = [
    path('users/signup/',SignUpView.as_view(), name='user-signup' ),
    path('users/profile/',UserProfileView.as_view(), name='get-user-details' ),
    path('users/profile/update/',UserProfileView.as_view(), name='update-user-details'),
    path('users/profile/delete/',UserProfileView.as_view(), name='remove-user' ),
    
    path('auth/login/',LoginInView.as_view(), name='user-login'),
    
    path("refresh/", RefreshTokenView.as_view(), name="generate-new-token"),

    path('genres/all/',GenresView.as_view(),name='list-genres'),
    path('movies/all/', MoviesView.as_view(), name='list-movies'),
    path('movies/<int:movie_id>/', MovieDetailsView.as_view(), name='details-of-a-specific-movie'),
    path('movies/add/', MovieViewAdmin.as_view(), name='add-movie-admin-only'),
    path('movies/bulkadd/', BulkCreateMovieView.as_view(), name='bulk-add-movies'),
    path('movies/update/<int:id>/', MovieViewAdmin.as_view(), name='update-movie-admin-only'),
    path('movies/delete/<int:id>/', MovieViewAdmin.as_view(), name='delete-movie-admin-only'),
    path('movies/filters/', MoviesFilterView.as_view(), name='filter-movies-by-genre-lan-city-rating'),
    path('movies/filters/byCategory/', MoviesFilterByCategory.as_view(), name='filter-movies-by-category'),
    path('movies/filters/byTitle/', MoviesFilterByTitle.as_view(), name='filter-movies-by-title'),
    
    path('theater/add/', TheaterView.as_view(), name='add-theater'),
    path('theater/all/', TheaterView.as_view(), name='list-theater'),
    path('theaters/<int:movie_id>/', TheatersMovieView.as_view(), name='all-theaters-of-specific-movie'),
    
    path('seats/all/by_theater_movie_id/', SeatsTheaterMovieView.as_view(), name='all-seats-of-specific-theater'),
    path('seats/<int:movie_id>/', SeatView.as_view(), name='seats-for-specific-movie-admin-only'),
    path('seats/reservation/add/', SeatView.as_view(), name='reserve-seat-admin-only'),
    path('seats/reservation/update/<int:seat_id>/', SeatView.as_view(), name='update-seat-reservation-admin-only'),
    path('seat/add/', SeatAdminView.as_view(), name='add-seat-admin-only'),
    path('seat/update/<int:id>/', SeatAdminView.as_view(), name='update-seat-admin-only'),
    path('seat/delete/<int:id>/', SeatAdminView.as_view(), name='delete-seat-admin-only'),
    
    
    
    path('tickets/', TicketView.as_view(), name='fetch-booked-tickets'),
    path('tickets/new/', TicketView.as_view(), name='book-new-ticket'),
    
    path('booking/all/',BookingsView.as_view(), name='booking-list'),
    path('booking/<int:booking_id>/', BookingView.as_view(), name='booking-summary'),
    path('booking/add/', BookingView.as_view(), name='add-new-booking'),
    path('booking/delete/<int:booking_id>/', BookingView.as_view(), name='delete-or-cancel-booking'),
    
]
