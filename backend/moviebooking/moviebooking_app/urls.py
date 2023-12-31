from django.urls import path
from .views import *

urlpatterns = [
    path('users/signup/',SignUpView.as_view(), name='user-signup' ),
    path('users/profile/',UserProfileView.as_view(), name='get-user-details' ),
    path('users/profile/update/',UserProfileView.as_view(), name='update-user-details'),
    path('users/profile/delete/',UserProfileView.as_view(), name='remove-user' ),
    path('users/getUser/', UserAdminView.as_view(), name="get-user-details-admin-only"),
    path('users/updateUser/<int:user_id>/', UserAdminView.as_view(), name="update-user-details-admin-only"),
    path('users/deleteUser/<int:user_id>/', UserAdminView.as_view(), name="delete-user-admin-only"),

    path('auth/login/',LoginInView.as_view(), name='user-login'),
    
    path("refresh/", RefreshTokenView.as_view(), name="generate-new-token"),

    path('genres/all/',GenresView.as_view(),name='list-genres'),
    path('movies/all/', MoviesView.as_view(), name='list-movies'),
    path('movies/<int:id>/', MovieDetailsView.as_view(), name='movie-details'),
    path('movies/byTitle/', MovieDetailsByTitleView.as_view(), name='details-of-a-specific-movie'),
    path('movies/add/', MovieViewAdmin.as_view(), name='add-movie-admin-only'),
    path('movies/bulkadd/', BulkCreateMovieView.as_view(), name='bulk-add-movies'),
    path('movies/update/<int:id>/', MovieViewAdmin.as_view(), name='update-movie-admin-only'),
    path('movies/delete/<int:id>/', MovieViewAdmin.as_view(), name='delete-movie-admin-only'),
    path('movies/filters/', MoviesFilterView.as_view(), name='filter-movies-by-genre-lan-city-rating'),
    path('movies/filters/byCategory/', MoviesFilterByCategory.as_view(), name='filter-movies-by-category'),
    path('movies/filters/byTitle/', MoviesFilterByTitle.as_view(), name='filter-movies-by-title'),
    
    path('theater/all/', TheaterView.as_view(), name='list-theater'),
    path('theaters/byName/', TheatersByTitleView.as_view(), name='fetch-theaters-by-name'),
    path('theater/get/<int:id>/', TheaterViewAdmin.as_view(), name="get-theater-admin-only"),
    path('theater/add/', TheaterViewAdmin.as_view(), name='add-theater-admin-only'),
    path('theater/update/<int:id>/', TheaterViewAdmin.as_view(), name='update-theater-admin-only'),
    path('theater/delete/<int:id>/', TheaterViewAdmin.as_view(), name='delete-theater-admin-only'),
    path('theaters/<int:movie_id>/', TheatersMovieView.as_view(), name='all-theaters-of-specific-movie'),
    
    path('seats/all/by_theater_movie_id/', SeatsTheaterMovieView.as_view(), name='all-seats-of-specific-theater'),
    path('seats/<int:seat_id>/', SeatView.as_view(), name='fetch-details-of-a-seat'),
    path('seat/add/', SeatAdminView.as_view(), name='add-seat-admin-only'),
    path('seat/update/<int:id>/', SeatAdminView.as_view(), name='update-seat-admin-only'),
    path('seat/delete/<int:id>/', SeatAdminView.as_view(), name='delete-seat-admin-only'),
    # path('seats/reservation/add/', SeatView.as_view(), name='reserve-seat-admin-only'),
    # path('seats/reservation/update/<int:seat_id>/', SeatView.as_view(), name='update-seat-reservation-admin-only'),
    
    
    
    # path('tickets/', TicketView.as_view(), name='fetch-booked-tickets'),
    # path('tickets/new/', TicketView.as_view(), name='book-new-ticket'),
    
    path('booking/all/',BookingView.as_view(), name='booking-list'),
    path('booking/<int:booking_id>/', BookingView.as_view(), name='booking-summary'),
    path('booking/add/', BookingView.as_view(), name='add-new-booking'),
    path('booking/delete/<int:booking_id>/', BookingView.as_view(), name='delete-or-cancel-booking'),

    
]
