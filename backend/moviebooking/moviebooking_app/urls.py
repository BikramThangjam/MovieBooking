from django.urls import path
from .views import *

urlpatterns = [
    path('users/signup/',SignUpView.as_view(), name='user-signup' ),
    path('users/profile/',UserProfileView.as_view(), name='get-user-details' ),
    path('users/profile/update/',UserProfileView.as_view(), name='update-user-details' ),
    path('users/profile/delete/',UserProfileView.as_view(), name='remove-user' ),
    
    path('auth/login/',LoginInView.as_view(), name='user-login'),
    
    path('movies/all/', MovieViews.as_view(), name='list-movies'),
    path('movies/add/', MovieViewAdmin.as_view(), name='add-movie-admin-only'),
    path('movies/update/<int:id>/', MovieViewAdmin.as_view(), name='update-movie-admin-only'),
    path('movies/delete/<int:id>/', MovieViewAdmin.as_view(), name='delete-movie-admin-only'),
    path('movies/filters/', MoviesFilterView.as_view(), name='filter-movies-by-genre-lan-city-rating'),
    
    path('theater/add/', TheaterView.as_view(), name='add-theater'),
    path('theater/all/', TheaterView.as_view(), name='list-theater'),
    
    path('seats/<int:movie_id>/', SeatView.as_view(), name='seats-for-specific-movie'),
    
]
